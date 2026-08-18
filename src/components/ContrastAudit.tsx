import { useEffect, useRef, useState } from 'react';
import { useDeck } from '../deck/DeckContext';

/* A slide that is a working tool: it measures the WCAG contrast of the
   CURRENT theme tokens, live. Re-theme on the ThemeLab or HueDial slides,
   come back, and the ratios re-audit themselves (a MutationObserver watches
   the :root style attribute). Nothing is hard-coded — the numbers are
   computed from whatever the tokens resolve to right now. */

const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: 'Body text', fg: '--fg', bg: '--bg' },
  { label: 'Muted text', fg: '--fg-muted', bg: '--bg' },
  { label: 'Text on accent', fg: '--accent-ink', bg: '--primary' },
  { label: 'Faint / decorative', fg: '--fg-faint', bg: '--bg' },
];

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function grade(ratio: number): { tag: string; ok: boolean } {
  if (ratio >= 7) return { tag: 'AAA', ok: true };
  if (ratio >= 4.5) return { tag: 'AA', ok: true };
  if (ratio >= 3) return { tag: 'AA large', ok: true };
  return { tag: 'decorative only', ok: false };
}

export default function ContrastAudit() {
  const { isStatic } = useDeck();
  const probeRef = useRef<HTMLSpanElement>(null);
  const [ratios, setRatios] = useState<number[] | null>(null);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resolve = (token: string): [number, number, number] | null => {
      probe.style.color = `var(${token})`;
      const computed = getComputedStyle(probe).color;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      try {
        ctx.fillStyle = computed;
      } catch {
        return null;
      }
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };

    const measure = () => {
      const next = PAIRS.map((p) => {
        const f = resolve(p.fg);
        const b = resolve(p.bg);
        if (!f || !b) return 0;
        const [l1, l2] = [luminance(f), luminance(b)].sort((a, z) => z - a);
        return (l1 + 0.05) / (l2 + 0.05);
      });
      setRatios(next);
    };

    measure();
    // re-audit when ThemeLab / HueDial rewrite :root inline styles
    const mo = new MutationObserver(measure);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });
    return () => mo.disconnect();
  }, []);

  return (
    <div style={{ maxWidth: 680, marginInline: 'auto', width: '100%' }}>
      <span ref={probeRef} aria-hidden style={{ display: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {PAIRS.map((p, i) => {
          const ratio = ratios?.[i] ?? 0;
          const g = grade(ratio);
          return (
            <div
              key={p.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(10px, 2vw, 18px)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair)',
                background: 'var(--surface)',
              }}
            >
              {/* live sample rendered with the actual tokens */}
              <span
                style={{
                  flexShrink: 0,
                  width: 74,
                  textAlign: 'center',
                  padding: '7px 0',
                  borderRadius: 8,
                  border: '1px solid var(--hair-2)',
                  background: `var(${p.bg})`,
                  color: `var(${p.fg})`,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Aa
              </span>
              <span style={{ fontWeight: 600, fontSize: 14.5, minWidth: 0 }}>
                {p.label}
                <span
                  className="hide-narrow"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--fg-faint)',
                    fontWeight: 400,
                    marginTop: 2,
                  }}
                >
                  {p.fg} on {p.bg}
                </span>
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 15,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {ratios ? `${ratio.toFixed(1)} : 1` : '…'}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: g.ok ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                  border: g.ok
                    ? '1px solid var(--line-accent)'
                    : '1px solid var(--hair)',
                  color: g.ok ? 'var(--fg)' : 'var(--fg-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {ratios ? g.tag : '·'}
              </span>
            </div>
          );
        })}
      </div>
      <p
        style={{
          textAlign: 'center',
          marginTop: 14,
          marginBottom: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-faint)',
        }}
      >
        {isStatic
          ? 'computed from the live tokens'
          : 'computed from the live tokens — re-theme on the Theme Lab and watch it re-audit'}
      </p>
    </div>
  );
}
