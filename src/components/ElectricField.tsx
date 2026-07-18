import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* A dependency-free animated canvas backdrop for the hero: drifting charge
   motes that shy away from the cursor, plus occasional lightning strikes in
   the theme's primary. Colors are probed from the live tokens (so ThemeLab
   recolors the storm too). Static thumbnails and reduced-motion get a quiet
   constellation instead of an animation. */
type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tw: number;
};
type Bolt = { pts: [number, number][]; born: number; life: number };

export default function ElectricField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();

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

    const probe = () => {
      const s = getComputedStyle(document.documentElement);
      return s.getPropertyValue('--primary').trim() || '#7c9bff';
    };
    let primary = probe();

    const motes: Mote[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
      r: Math.random() * 1.6 + 0.5,
      tw: Math.random() * Math.PI * 2,
    }));

    const drawStill = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = primary;
      for (const m of motes) {
        ctx.globalAlpha = 0.1 + (m.r / 2.1) * 0.25;
        ctx.beginPath();
        ctx.arc(m.x * W, m.y * H, m.r, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (isStatic || reduce) {
      drawStill();
      return;
    }

    const mouse = { x: 0.5, y: 0.42, on: false };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      mouse.on = true;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', fit);

    let bolts: Bolt[] = [];
    const makeBolt = () => {
      const x0 = Math.random();
      const x1 = Math.min(0.96, Math.max(0.04, x0 + (Math.random() - 0.5) * 0.5));
      const y1 = 0.35 + Math.random() * 0.45;
      const segs = 15;
      const pts: [number, number][] = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        pts.push([
          x0 + (x1 - x0) * t + (i && i < segs ? (Math.random() - 0.5) * 0.05 : 0),
          -0.04 + (y1 + 0.04) * t + (i && i < segs ? (Math.random() - 0.5) * 0.012 : 0),
        ]);
      }
      bolts.push({ pts, born: performance.now(), life: 380 + Math.random() * 280 });
    };
    let nextBolt = performance.now() + 1400;

    let raf = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      ctx.clearRect(0, 0, W, H);

      if (now > nextBolt) {
        primary = probe();
        makeBolt();
        if (Math.random() < 0.3) makeBolt();
        nextBolt = now + 2400 + Math.random() * 2800;
      }

      ctx.fillStyle = primary;
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.tw += 0.02;
        if (mouse.on) {
          const dx = mouse.x - m.x;
          const dy = mouse.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.018 && d2 > 0.00001) {
            m.x -= dx * 0.006;
            m.y -= dy * 0.006;
          }
        }
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        if (m.y < -0.02) m.y = 1.02;
        if (m.y > 1.02) m.y = -0.02;
        ctx.globalAlpha = Math.max(0.04, 0.2 + Math.sin(m.tw) * 0.16);
        ctx.beginPath();
        ctx.arc(m.x * W, m.y * H, m.r, 0, 7);
        ctx.fill();
      }

      bolts = bolts.filter((b) => now - b.born < b.life);
      for (const b of bolts) {
        const t = (now - b.born) / b.life;
        const alpha = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
        ctx.globalAlpha = Math.max(0, alpha) * 0.85;
        ctx.strokeStyle = primary;
        ctx.lineWidth = 1.7;
        ctx.lineJoin = 'round';
        ctx.shadowColor = primary;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        b.pts.forEach(([x, y], i) =>
          i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', fit);
    };
  }, [isStatic, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.85,
      }}
    />
  );
}
