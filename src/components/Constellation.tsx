import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* Interactive graph of the deck system. Hover a node for a blurb; the canvas
   softly attracts neighbors toward the pointer. Zero deps, token colors. */
type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  group: 'engine' | 'chrome' | 'library' | 'you';
  blurb: string;
};

const NODES: Omit<Node, 'x' | 'y'>[] = [
  { id: 'deck', label: 'Deck', r: 18, group: 'engine', blurb: 'Paged stage, hash, builds, chrome.' },
  { id: 'slide', label: 'Slide', r: 14, group: 'engine', blurb: 'One full-viewport React tree.' },
  { id: 'build', label: 'Build', r: 12, group: 'engine', blurb: 'Click-steps, both directions.' },
  { id: 'dock', label: 'Dock', r: 11, group: 'chrome', blurb: 'Floating glass controls.' },
  { id: 'rail', label: 'Rail', r: 11, group: 'chrome', blurb: 'Thumbnail sidebar · S' },
  { id: 'grid', label: 'Grid', r: 11, group: 'chrome', blurb: 'Overview of every slide · G' },
  { id: 'ink', label: 'Ink', r: 11, group: 'chrome', blurb: 'Content-anchored annotations · A' },
  { id: 'present', label: 'Present', r: 12, group: 'chrome', blurb: 'Synced second tab · P' },
  { id: 'tokens', label: 'Tokens', r: 13, group: 'you', blurb: 'One :root block themes everything.' },
  { id: 'skill', label: 'Skill', r: 13, group: 'you', blurb: 'Agent-facing authoring guide.' },
  { id: 'lib', label: 'Library', r: 15, group: 'library', blurb: '29 components · still growing.' },
  { id: 'custom', label: 'Yours', r: 14, group: 'you', blurb: 'Write new slides when nothing fits.' },
];

const EDGES: [string, string][] = [
  ['deck', 'slide'],
  ['deck', 'build'],
  ['deck', 'dock'],
  ['deck', 'rail'],
  ['deck', 'grid'],
  ['deck', 'ink'],
  ['deck', 'present'],
  ['slide', 'lib'],
  ['slide', 'custom'],
  ['tokens', 'deck'],
  ['tokens', 'lib'],
  ['skill', 'custom'],
  ['skill', 'tokens'],
  ['lib', 'custom'],
  ['build', 'slide'],
];

function layout(): Node[] {
  /* fixed polar layout so thumbnails stay stable */
  const cx = 0.5;
  const cy = 0.52;
  const ring = [
    { ids: ['deck'], radius: 0 },
    { ids: ['slide', 'build', 'tokens', 'lib'], radius: 0.22 },
    {
      ids: ['dock', 'rail', 'grid', 'ink', 'present', 'skill', 'custom'],
      radius: 0.38,
    },
  ];
  const pos = new Map<string, { x: number; y: number }>();
  for (const band of ring) {
    band.ids.forEach((id, i) => {
      if (band.radius === 0) {
        pos.set(id, { x: cx, y: cy });
        return;
      }
      const a = -Math.PI / 2 + (i / band.ids.length) * Math.PI * 2;
      pos.set(id, {
        x: cx + Math.cos(a) * band.radius,
        y: cy + Math.sin(a) * band.radius * 0.92,
      });
    });
  }
  return NODES.map((n) => ({ ...n, ...pos.get(n.id)! }));
}

export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const base = useMemo(() => layout(), []);
  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, on: false });

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.max(1, W * dpr);
      cv.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    let ro: ResizeObserver | null = null;

    const probe = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        primary: s.getPropertyValue('--primary').trim() || '#7c9bff',
        fg: s.getPropertyValue('--fg').trim() || '#f2f5ff',
        muted: s.getPropertyValue('--fg-muted').trim() || '#99a3c0',
        hair: s.getPropertyValue('--hair').trim() || 'rgba(163,183,255,0.14)',
        surface: s.getPropertyValue('--surface').trim() || 'rgba(255,255,255,0.045)',
      };
    };

    const nodes = base.map((n) => ({ ...n, px: n.x, py: n.y }));
    let raf = 0;
    let t = 0;

    const hit = (mx: number, my: number) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = mx - n.px * W;
        const dy = my - n.py * H;
        if (dx * dx + dy * dy < (n.r + 10) ** 2) return n.id;
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      mouse.current = { x: mx / W, y: my / H, on: true };
      const id = hit(mx, my);
      if (id !== hoverRef.current) setHover(id);
    };
    const onLeave = () => {
      mouse.current.on = false;
      setHover(null);
    };
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);

    const draw = () => {
      t += 0.016;
      const c = probe();
      ctx.clearRect(0, 0, W, H);

      /* soft field */
      const g = ctx.createRadialGradient(
        W * 0.5,
        H * 0.5,
        10,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.55
      );
      g.addColorStop(0, withAlpha(c.primary, 0.08));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (!isStatic && !reduce) {
        for (const n of nodes) {
          const breath = Math.sin(t * 1.1 + n.x * 8) * 0.004;
          let tx = n.x;
          let ty = n.y + breath;
          if (mouse.current.on) {
            const dx = mouse.current.x - n.x;
            const dy = mouse.current.y - n.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < 0.35) {
              const pull = (0.35 - d) * 0.04;
              tx += dx * pull;
              ty += dy * pull;
            }
          }
          n.px += (tx - n.px) * 0.12;
          n.py += (ty - n.py) * 0.12;
        }
      } else {
        for (const n of nodes) {
          n.px = n.x;
          n.py = n.y;
        }
      }

      const byId = new Map(nodes.map((n) => [n.id, n]));
      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        const A = byId.get(a)!;
        const B = byId.get(b)!;
        const hot =
          hoverRef.current === a ||
          hoverRef.current === b ||
          (!hoverRef.current && (a === 'deck' || b === 'deck'));
        ctx.strokeStyle = withAlpha(c.primary, hot ? 0.45 : 0.14);
        ctx.beginPath();
        ctx.moveTo(A.px * W, A.py * H);
        ctx.lineTo(B.px * W, B.py * H);
        ctx.stroke();
      }

      for (const n of nodes) {
        const hot = hoverRef.current === n.id;
        const x = n.px * W;
        const y = n.py * H;
        if (hot) {
          ctx.beginPath();
          ctx.fillStyle = withAlpha(c.primary, 0.18);
          ctx.arc(x, y, n.r + 14, 0, 7);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = hot ? c.primary : c.surface;
        ctx.strokeStyle = hot ? c.primary : c.hair;
        ctx.lineWidth = 1.5;
        ctx.arc(x, y, n.r, 0, 7);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = hot ? c.fg : c.muted;
        ctx.font = `600 ${hot ? 13 : 11}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(n.label, x, y + n.r + 6);
      }

      if (!isStatic && !reduce) raf = requestAnimationFrame(draw);
    };

    /* Resize clears the bitmap (width/height set). Still path must repaint. */
    ro = new ResizeObserver(() => {
      fit();
      if (isStatic || reduce) draw();
    });
    ro.observe(cv);

    /* one kick: draw paints still frame; animated path self-schedules */
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, [base, isStatic, reduce]);

  const blurb = NODES.find((n) => n.id === hover);

  return (
    <div
      style={{
        maxWidth: 880,
        marginInline: 'auto',
        width: '100%',
        display: 'grid',
        gap: 12,
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          overflow: 'hidden',
          aspectRatio: '16 / 10',
          boxShadow: 'var(--shadow)',
        }}
      >
        <canvas
          ref={ref}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 14,
            minHeight: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: blurb ? 'var(--fg)' : 'var(--fg-muted)',
              background: 'color-mix(in srgb, var(--bg) 70%, transparent)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--hair-2)',
              borderRadius: 999,
              padding: '8px 14px',
              maxWidth: '100%',
            }}
          >
            {blurb
              ? `${blurb.label} — ${blurb.blurb}`
              : 'Hover a node · the graph leans toward your cursor'}
          </span>
        </div>
      </div>
    </div>
  );
}

function withAlpha(color: string, a: number) {
  if (color.startsWith('#')) {
    const h = color.slice(1);
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h.slice(0, 6);
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${a})`);
  }
  return color;
}
