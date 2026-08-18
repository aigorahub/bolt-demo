import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* Motion, level 2 — one toy, three framer-motion patterns:
   · layout / layoutId: the SAME four cards morph between arrangements
   · staggerChildren: they enter as a related group, not four <Build>s
   · AnimatePresence: the focus caption exits, not just enters
   The engine's MotionConfig reducedMotion="user" makes all of it honor
   prefers-reduced-motion for free. Tokens only, no new dependencies. */

type Mode = 'grid' | 'row' | 'focus';

const CARDS = [
  { id: 'setup', label: 'Setup' },
  { id: 'tension', label: 'Tension' },
  { id: 'punchline', label: 'Punchline' },
  { id: 'ask', label: 'Ask' },
];

const MODES: { id: Mode; label: string }[] = [
  { id: 'grid', label: 'Grid' },
  { id: 'row', label: 'Row' },
  { id: 'focus', label: 'Focus' },
];

export default function MotionLab() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>('grid');

  const spring = { type: 'spring' as const, stiffness: 320, damping: 30 };

  return (
    <div style={{ maxWidth: 720, marginInline: 'auto', width: '100%' }}>
      {/* segmented control */}
      <div
        role="tablist"
        aria-label="Layout mode"
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 999,
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          width: 'fit-content',
          marginInline: 'auto',
          marginBottom: 18,
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={isStatic ? undefined : () => setMode(m.id)}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              font: 'inherit',
              fontSize: 13.5,
              fontWeight: 600,
              position: 'relative',
              padding: '7px 18px',
              borderRadius: 999,
              border: 'none',
              background: 'transparent',
              color: mode === m.id ? 'var(--accent-ink)' : 'var(--fg-muted)',
              cursor: isStatic ? 'default' : 'pointer',
            }}
          >
            {mode === m.id && (
              <motion.span
                layoutId="motionlab-pill"
                transition={spring}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  background: 'var(--accent)',
                }}
              />
            )}
            <span style={{ position: 'relative' }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* the same four cards, re-arranged — layout does the animation */}
      <motion.div
        initial={isStatic || reduce ? false : 'hidden'}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        style={{
          display: mode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns:
            mode === 'grid' ? 'repeat(2, minmax(0, 1fr))' : undefined,
          flexDirection: mode === 'row' ? 'row' : 'column',
          flexWrap: mode === 'row' ? 'wrap' : undefined,
          gap: 12,
          minHeight: 200,
          alignContent: 'start',
        }}
      >
        {CARDS.map((c, i) => {
          const hero = mode === 'focus' && i === 2;
          const small = mode === 'focus' && i !== 2;
          return (
            <motion.div
              key={c.id}
              layout
              layoutId={`motionlab-${c.id}`}
              transition={spring}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              style={{
                order: hero ? -1 : 0,
                flex: mode === 'row' ? '1 1 120px' : undefined,
                padding: hero
                  ? '22px 24px'
                  : small
                    ? '10px 16px'
                    : mode === 'grid'
                      ? '26px 22px'
                      : '18px 20px',
                borderRadius: 'var(--radius-sm)',
                border: hero
                  ? '1px solid var(--line-accent)'
                  : '1px solid var(--hair)',
                background: hero ? 'var(--accent-soft)' : 'var(--surface)',
                boxShadow: hero ? 'var(--glow)' : 'none',
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span
                className="kicker accent-text"
                style={{ fontSize: hero ? 13 : 11 }}
              >
                0{i + 1}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: hero ? 'clamp(19px, 2.4vw, 24px)' : 15,
                }}
              >
                {c.label}
              </span>
              <AnimatePresence>
                {hero && (
                  <motion.span
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: 8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginLeft: 'auto',
                      fontSize: 12.5,
                      color: 'var(--text-muted)',
                    }}
                    className="hide-narrow"
                  >
                    same element — it morphed here
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      <p
        style={{
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-faint)',
        }}
      >
        layout · layoutId · staggerChildren · AnimatePresence — and
        prefers-reduced-motion turns it all off
      </p>
    </div>
  );
}
