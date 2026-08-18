import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';
import { useInView } from '../deck/useInView';

/* A treemap — the chart the built-ins don't have, hand-rolled to prove the
   ceiling is fake. Real data: all 29 library components, one tile each,
   columns sized by shelf share. Hover or tap a shelf to isolate it. Tokens
   only (the accent is mixed per-shelf with color-mix), no chart library. */

const SHELVES: { name: string; items: string[] }[] = [
  { name: 'Structure', items: ['Cover', 'Agenda', 'Section', 'Split', 'Bento'] },
  {
    name: 'Data',
    items: [
      'BarChart',
      'LineChart',
      'DonutChart',
      'Table',
      'StatGrid',
      'BigNumber',
      'CountUp',
      'VisualDashboard',
    ],
  },
  {
    name: 'Story',
    items: ['Quote', 'Contrast', 'Comparison', 'Timeline', 'Steps', 'Chat'],
  },
  { name: 'Product', items: ['CodeWindow', 'BrowserFrame', 'Pricing', 'Team'] },
  {
    name: 'Flair',
    items: ['Globe', 'TiltCard', 'SpotlightCard', 'Marquee', 'Accordion', 'Tabs'],
  },
];
const TOTAL = SHELVES.reduce((s, d) => s + d.items.length, 0);

export default function TokenTreemap() {
  const { isStatic } = useDeck();
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [active, setActive] = useState<string | null>(null);

  let tileIndex = 0;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 4,
          height: 'clamp(230px, 32vh, 320px)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        {SHELVES.map((shelf, si) => {
          const dim = active !== null && active !== shelf.name;
          // each shelf keeps its own tint of the ONE accent — no new palette
          const mix = 26 - si * 4;
          return (
            <div
              key={shelf.name}
              onMouseEnter={isStatic ? undefined : () => setActive(shelf.name)}
              onMouseLeave={isStatic ? undefined : () => setActive(null)}
              onClick={
                isStatic
                  ? undefined
                  : () => setActive((a) => (a === shelf.name ? null : shelf.name))
              }
              style={{
                flexGrow: shelf.items.length,
                flexBasis: 0,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                opacity: dim ? 0.32 : 1,
                transition: 'opacity 0.3s',
                cursor: isStatic ? 'default' : 'pointer',
              }}
            >
              {shelf.items.map((name) => {
                const i = tileIndex++;
                return (
                  <motion.div
                    key={name}
                    initial={isStatic ? false : { opacity: 0, scale: 0.92 }}
                    animate={
                      inView ? { opacity: 1, scale: 1 } : undefined
                    }
                    transition={{
                      duration: 0.4,
                      delay: i * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 6,
                      background: `color-mix(in srgb, var(--primary) ${mix}%, var(--surface-2))`,
                      border: '1px solid var(--hair-2)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '4px 7px',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(8.5px, 1.1vw, 11.5px)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        color: 'var(--fg)',
                        opacity: 0.85,
                      }}
                    >
                      {name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p
        style={{
          marginTop: 12,
          marginBottom: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-faint)',
          minHeight: '1.5em',
        }}
      >
        {active
          ? `${active} — ${SHELVES.find((s) => s.name === active)!.items.length} of ${TOTAL} components`
          : `${TOTAL} components · column width = shelf share · hover a shelf`}
      </p>
    </div>
  );
}
