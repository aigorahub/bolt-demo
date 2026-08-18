import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* The "next level" checklist, as an interactive slide — because a checklist
   about interactivity should obviously be one. Click to check items; the
   tally re-counts; at 6/6 the verdict lands. Tokens only, reduced-motion
   safe, no dependencies. */

const ITEMS = [
  'At least one slide lets the audience do something',
  'Charts read the tokens, not default palettes',
  'Motion is purposeful, never decorative',
  'One slide could ship as a standalone prototype',
  'The best custom components are extracted for reuse',
  'It still feels calm at presentation speed',
];

export default function ShipChecklist() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [done, setDone] = useState<boolean[]>(() =>
    ITEMS.map(() => isStatic)
  );
  const count = done.filter(Boolean).length;
  const all = count === ITEMS.length;

  const toggle = (i: number) =>
    setDone((d) => d.map((v, k) => (k === i ? !v : v)));

  return (
    <div style={{ maxWidth: 640, marginInline: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ITEMS.map((label, i) => {
          const on = done[i];
          return (
            <button
              key={i}
              onClick={isStatic ? undefined : () => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
              }}
              aria-pressed={on}
              style={{
                font: 'inherit',
                color: 'inherit',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: on
                  ? '1px solid var(--line-accent)'
                  : '1px solid var(--hair)',
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
                cursor: isStatic ? 'default' : 'pointer',
                transition: 'border-color 0.25s, background 0.25s',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  borderRadius: 7,
                  border: on ? 'none' : '1px solid var(--hair)',
                  background: on ? 'var(--accent)' : 'var(--surface-elevated)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--accent-ink)',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'background 0.25s',
                }}
              >
                {on ? '✓' : ''}
              </span>
              <span
                style={{
                  fontSize: 15,
                  lineHeight: 1.4,
                  color: on ? 'var(--fg)' : 'var(--text-muted)',
                  transition: 'color 0.25s',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          minHeight: 40,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {count} / {ITEMS.length}
        </span>
        <AnimatePresence>
          {all && (
            <motion.span
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 17,
                padding: '7px 20px',
                borderRadius: 999,
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
              }}
            >
              Ship it.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
