import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* "Animate data changes when you reveal new information with builds" — this
   chart IS the build. It registers two click-steps with the engine, so the
   → key doesn't reveal hidden text: it re-sorts and re-scales the SAME bars
   (layout animation on real data — the 29 components per shelf). Static
   previews show the final beat. Tokens only, no chart library. */

const SHELVES = [
  { name: 'Structure', count: 5 },
  { name: 'Data', count: 8 },
  { name: 'Story', count: 6 },
  { name: 'Product', count: 4 },
  { name: 'Flair', count: 6 },
];
const TOTAL = SHELVES.reduce((s, d) => s + d.count, 0);

const CAPTIONS = [
  'Beat 0 — the library counted, shelf by shelf. Press →.',
  'Beat 1 — same bars, re-sorted. Nothing was hidden; the data moved.',
  'Beat 2 — same bars again, re-scaled to share of all 29.',
];

export default function MorphingChart() {
  const { clicks, isStatic, registerMax } = useDeck();
  const reduce = useReducedMotion();
  useEffect(() => {
    registerMax?.(2);
  }, [registerMax]);

  const beat = isStatic ? 2 : Math.min(clicks, 2);
  const rows =
    beat === 0 ? SHELVES : [...SHELVES].sort((a, b) => b.count - a.count);
  const max = Math.max(...SHELVES.map((d) => d.count));
  const top = rows[0].name;

  return (
    <div style={{ maxWidth: 680, marginInline: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((d) => {
          const share = (d.count / TOTAL) * 100;
          /* beat 0–1: scaled to the tallest bar; beat 2: LITERAL share of
             all 29, so every bar visibly shrinks on the second click */
          const w = beat === 2 ? share : (d.count / max) * 100;
          const lead = beat > 0 && d.name === top;
          return (
            <motion.div
              key={d.name}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(72px, 96px) 1fr 58px',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: lead ? 'var(--fg)' : 'var(--fg-muted)',
                  textAlign: 'right',
                }}
              >
                {d.name}
              </span>
              <div
                style={{
                  height: 30,
                  borderRadius: 8,
                  background: 'var(--surface)',
                  border: '1px solid var(--hair-2)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ width: `${w}%` }}
                  /* width is not a transform, so reducedMotion="user" won't
                     catch it — honor reduced motion explicitly */
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                  }
                  style={{
                    height: '100%',
                    borderRadius: 8,
                    background: lead ? 'var(--accent)' : 'var(--accent-soft)',
                    borderRight: lead ? 'none' : '2px solid var(--primary)',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: lead ? 'var(--fg)' : 'var(--fg-muted)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {beat === 2 ? `${share.toFixed(0)}%` : d.count}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p
        style={{
          textAlign: 'center',
          marginTop: 18,
          marginBottom: 0,
          fontSize: 13.5,
          color: 'var(--text-muted)',
          minHeight: '1.5em',
        }}
      >
        {CAPTIONS[beat]}
      </p>
    </div>
  );
}
