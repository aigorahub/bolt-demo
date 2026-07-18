import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* The "no fixed canvas" pitch as a toy: a mini page inside a resizable
   viewport. It breathes between phone and desktop width on its own — grab
   the right-edge handle and it's yours. The mock re-lays itself out from
   the live width (3 columns → 2 → 1, nav collapses to ☰), with a px readout.
   Slideware clips at one size; this reflows at every size. */
const BREAK_2COL = 640;
const BREAK_1COL = 430;
const BREAK_NAV = 520;
const MIN_W = 300;

const bar = (w: string, accent = false): React.CSSProperties => ({
  height: 7,
  width: w,
  borderRadius: 4,
  background: accent ? 'var(--accent)' : 'var(--hair)',
});

export default function ResponsivePlayground() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [maxW, setMaxW] = useState(880);
  const [manual, setManual] = useState<number | null>(null);
  const [autoW, setAutoW] = useState(880);
  const dragging = useRef(false);

  /* track available width */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setMaxW(Math.max(MIN_W, el.getBoundingClientRect().width - 26));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* idle breathing between narrow and wide until the user grabs the handle */
  useEffect(() => {
    if (isStatic || reduce || manual != null) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const t = (now - t0) / 1000;
      const k = 0.5 + 0.5 * Math.sin(t * 0.42);
      setAutoW(MIN_W + (maxW - MIN_W) * (0.28 + 0.72 * k));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isStatic, reduce, manual, maxW]);

  const width = Math.round(
    Math.min(maxW, Math.max(MIN_W, manual ?? (isStatic || reduce ? maxW : autoW)))
  );

  const cols = width > BREAK_2COL ? 3 : width > BREAK_1COL ? 2 : 1;

  const onPointerDown = (e: React.PointerEvent) => {
    if (isStatic) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    setManual((e.clientX - center) * 2);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <div
        style={{
          width,
          maxWidth: '100%',
          marginInline: 'auto',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow)',
          position: 'relative',
          padding: 'clamp(12px, 2vw, 18px)',
          textAlign: 'left',
        }}
      >
        {/* readout */}
        <div
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            padding: '3px 12px',
            borderRadius: 999,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            whiteSpace: 'nowrap',
          }}
        >
          {width} px
        </div>

        {/* grab handle */}
        <div
          role="slider"
          aria-label="Viewport width"
          aria-valuemin={MIN_W}
          aria-valuemax={maxW}
          aria-valuenow={width}
          tabIndex={isStatic ? -1 : 0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.stopPropagation();
              e.preventDefault();
              const d = e.key === 'ArrowRight' ? 40 : -40;
              setManual(Math.min(maxW, Math.max(MIN_W, width + d)));
            }
          }}
          style={{
            position: 'absolute',
            right: -9,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 52,
            borderRadius: 999,
            background: 'var(--surface-2)',
            border: '1px solid var(--primary)',
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            touchAction: 'none',
          }}
        >
          <span style={{ width: 2, height: 18, borderRadius: 1, background: 'var(--primary)' }} />
          <span style={{ width: 2, height: 18, borderRadius: 1, background: 'var(--primary)' }} />
        </div>

        {/* mini page: nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottom: '1px solid var(--hair-2)',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                background: 'var(--accent)',
              }}
            />
            <span style={{ fontWeight: 650, fontSize: 14 }}>Acme</span>
          </div>
          {width > BREAK_NAV ? (
            <div style={{ display: 'flex', gap: 14 }}>
              {['Product', 'Docs', 'Pricing'].map((n) => (
                <span key={n} style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                  {n}
                </span>
              ))}
            </div>
          ) : (
            <span aria-hidden style={{ color: 'var(--fg-muted)', fontSize: 16 }}>
              ☰
            </span>
          )}
        </div>

        {/* hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <div style={bar(width > BREAK_1COL ? '52%' : '86%', true)} />
          <div style={bar(width > BREAK_1COL ? '38%' : '68%')} />
        </div>

        {/* cards — real reflow, driven by the live width */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 10,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair-2)',
                background: 'var(--surface-2)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              }}
            >
              <div style={bar('40%', i === 0)} />
              <div style={bar('84%')} />
              <div style={bar('64%')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
