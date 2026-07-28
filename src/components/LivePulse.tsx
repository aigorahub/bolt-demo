import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';
import CountUp from './CountUp';

/* A fake live room pulse: click options, bars grow, total re-counts.
   Proves a slide can take audience input mid-talk without leaving the deck. */
const OPTIONS = [
  { id: 'wow', label: 'I’m in — ship live decks', seed: 34 },
  { id: 'maybe', label: 'Curious, need a real brief', seed: 28 },
  { id: 'skeptic', label: 'Still married to PowerPoint', seed: 12 },
  { id: 'agent', label: 'Point my agent at the repo tonight', seed: 41 },
];

export default function LivePulse() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [votes, setVotes] = useState(() =>
    Object.fromEntries(OPTIONS.map((o) => [o.id, o.seed]))
  );
  const [last, setLast] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  /* ambient drift so the board feels alive even before clicks */
  useEffect(() => {
    if (isStatic || reduce) return;
    const id = window.setInterval(() => {
      setVotes((v) => {
        const next = { ...v };
        const pick = OPTIONS[Math.floor(Math.random() * OPTIONS.length)].id;
        next[pick] = next[pick] + 1;
        return next;
      });
      setPulse((p) => p + 1);
    }, 2400);
    return () => clearInterval(id);
  }, [isStatic, reduce]);

  const total = useMemo(
    () => Object.values(votes).reduce((a, b) => a + b, 0),
    [votes]
  );
  const max = Math.max(...Object.values(votes), 1);

  const cast = (id: string) => {
    setVotes((v) => ({ ...v, [id]: v[id] + 1 }));
    setLast(id);
    setPulse((p) => p + 1);
  };

  return (
    <div
      style={{
        maxWidth: 820,
        marginInline: 'auto',
        width: '100%',
        display: 'grid',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="kicker" style={{ marginBottom: 6 }}>
            live pulse · room-only
          </div>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(22px,2.6vw,28px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            How does this feel, right now?
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(32px,4vw,44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <CountUp key={pulse} to={total} duration={550} />
          </div>
          <div className="foot" style={{ margin: 0 }}>
            votes · click a bar
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {OPTIONS.map((o) => {
          const n = votes[o.id];
          const pct = Math.round((n / max) * 100);
          const share = total ? Math.round((n / total) * 100) : 0;
          const on = last === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cast(o.id);
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
              }}
              style={{
                appearance: 'none',
                textAlign: 'left',
                font: 'inherit',
                color: 'inherit',
                cursor: 'pointer',
                border: `1px solid ${on ? 'color-mix(in srgb, var(--primary) 55%, var(--hair))' : 'var(--hair)'}`,
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                padding: '12px 14px',
                display: 'grid',
                gap: 8,
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>{o.label}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--fg-muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {n} · {share}%
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: 'var(--hair-2)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={
                    reduce || isStatic
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 24 }
                  }
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    background: 'var(--accent)',
                    minWidth: n ? 8 : 0,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="foot" style={{ margin: 0, textAlign: 'center' }}>
        Numbers drift on their own, then jump when you click — mid-talk input,
        no second tool.
      </p>
    </div>
  );
}
