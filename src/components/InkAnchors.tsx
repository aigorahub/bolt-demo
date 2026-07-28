import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* Shows why annotations are content-anchored: the same ink rides three
   different layouts (desktop / tablet / phone). Circles track the KPI cards
   as the grid reflows — the point of pressing A on a real deck. */
type Layout = 'desktop' | 'tablet' | 'phone';

const LAYOUTS: { id: Layout; label: string; width: number }[] = [
  { id: 'desktop', label: 'Laptop', width: 100 },
  { id: 'tablet', label: 'Tablet', width: 72 },
  { id: 'phone', label: 'Phone', width: 42 },
];

const KPIS = [
  { id: 'rev', label: 'Revenue', value: '$2.4M', accent: true },
  { id: 'nrr', label: 'NRR', value: '118%' },
  { id: 'churn', label: 'Churn', value: '1.8%' },
];

export default function InkAnchors() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [layout, setLayout] = useState<Layout>('desktop');
  const [drawn, setDrawn] = useState(isStatic || !!reduce);
  const [userPicked, setUserPicked] = useState(false);

  useEffect(() => {
    if (isStatic || reduce) return;
    setDrawn(false);
    const t = window.setTimeout(() => setDrawn(true), 380);
    return () => clearTimeout(t);
  }, [layout, isStatic, reduce]);

  /* auto-cycle layouts so the room sees the reflow without a clicker script */
  useEffect(() => {
    if (isStatic || reduce || userPicked) return;
    const id = window.setInterval(() => {
      setLayout((cur) => {
        const i = LAYOUTS.findIndex((l) => l.id === cur);
        return LAYOUTS[(i + 1) % LAYOUTS.length].id;
      });
    }, 3200);
    return () => clearInterval(id);
  }, [isStatic, reduce, userPicked]);

  const w = LAYOUTS.find((l) => l.id === layout)!.width;
  const cols =
    layout === 'desktop' ? 'repeat(3, 1fr)' : layout === 'tablet' ? '1fr 1fr' : '1fr';

  return (
    <div
      style={{
        maxWidth: 880,
        marginInline: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {LAYOUTS.map((l) => {
          const on = l.id === layout;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={on}
              onClick={(e) => {
                e.stopPropagation();
                setUserPicked(true);
                setLayout(l.id);
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
              }}
              style={{
                font: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                border: '1px solid ' + (on ? 'transparent' : 'var(--hair)'),
                background: on ? 'var(--accent)' : 'var(--surface)',
                color: on ? 'var(--accent-ink)' : 'var(--fg-muted)',
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          style={{
            width: `${w}%`,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--hair)',
            background: 'var(--surface)',
            padding: layout === 'phone' ? 14 : 20,
            boxShadow: 'var(--shadow)',
            position: 'relative',
          }}
        >
          <div
            className="kicker"
            style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}
          >
            <span>acme · overview</span>
            <span style={{ color: 'var(--fg-faint)' }}>content-anchored</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              gap: 12,
            }}
          >
            {KPIS.map((k) => (
              <motion.div
                key={k.id}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  position: 'relative',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--hair-2)',
                  background: 'var(--surface-2)',
                }}
              >
                <div className="kicker" style={{ marginBottom: 6 }}>
                  {k.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: layout === 'phone' ? 26 : 30,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {k.value}
                </div>

                {/* the "annotation" — rides the layout node, not screen coords */}
                {k.accent && drawn && (
                  <svg
                    aria-hidden
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      inset: -10,
                      width: 'calc(100% + 20px)',
                      height: 'calc(100% + 20px)',
                      pointerEvents: 'none',
                      overflow: 'visible',
                    }}
                  >
                    <motion.ellipse
                      cx="50"
                      cy="50"
                      rx="46"
                      ry="42"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="4 3"
                      initial={
                        isStatic || reduce
                          ? false
                          : { pathLength: 0, opacity: 0 }
                      }
                      animate={{ pathLength: 1, opacity: 0.95 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ transformOrigin: 'center' }}
                    />
                    <motion.path
                      d="M72 18 C 78 12, 88 14, 90 22"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={
                        isStatic || reduce
                          ? false
                          : { pathLength: 0, opacity: 0 }
                      }
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 0.45, delay: 0.45 }}
                    />
                  </svg>
                )}
              </motion.div>
            ))}
          </div>

          {layout !== 'phone' && (
            <div
              style={{
                marginTop: 14,
                height: 56,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair-2)',
                background:
                  'linear-gradient(90deg, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%), var(--surface-2)',
              }}
            />
          )}
        </motion.div>
      </div>

      <p className="foot" style={{ textAlign: 'center', margin: 0 }}>
        Circle the revenue tile · switch devices · the ink stays on the number.
        Press <strong style={{ color: 'var(--fg)' }}>A</strong> to draw for real.
      </p>
    </div>
  );
}
