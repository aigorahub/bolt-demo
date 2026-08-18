import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';
import BrowserFrame from './BrowserFrame';

/* The signature auto-playing moment: a bolt.new-style window where a prompt
   types itself, the agent reports progress, and a six-slide mini deck springs
   together — then it loops, like the launch video, except it's live DOM.
   Static renders (thumbnail rail, grid) and reduced-motion get the finished
   frame. No dependencies beyond the framer-motion already in the repo. */
const PROMPT = 'Build me a deck pitching Acme to investors — make it beautiful.';
const STATUSES = [
  'Reading the skill…',
  'Theming the tokens…',
  'Writing the slides…',
];
const MINIS = 6;

const miniCard: React.CSSProperties = {
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--hair)',
  background: 'var(--surface)',
  padding: 10,
  minHeight: 84,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 6,
  overflow: 'hidden',
};

const bar = (w: string, accent = false): React.CSSProperties => ({
  height: 5,
  width: w,
  borderRadius: 3,
  background: accent ? 'var(--accent)' : 'var(--hair)',
});

function MiniSlide({ i }: { i: number }) {
  if (i === 0)
    return (
      <div style={{ ...miniCard, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)' }}>
          Acme
        </div>
        <div style={bar('58%', true)} />
        <div style={bar('42%')} />
      </div>
    );
  if (i === 1)
    return (
      <div
        style={{
          ...miniCard,
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 5,
          paddingBottom: 12,
        }}
      >
        {[34, 58, 44, 78, 100].map((h, k) => (
          <div
            key={k}
            style={{
              flex: 1,
              height: `${h * 0.52}%`,
              borderRadius: 3,
              background: k === 3 ? 'var(--accent)' : 'var(--surface-2)',
              border: '1px solid var(--hair-2)',
            }}
          />
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div style={{ ...miniCard, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={bar('90%')} />
          <div style={bar('70%')} />
          <div style={bar('50%', true)} />
        </div>
        <div
          style={{
            flex: 1,
            alignSelf: 'stretch',
            borderRadius: 8,
            background:
              'radial-gradient(120% 120% at 30% 20%, color-mix(in srgb, var(--primary) 32%, transparent), transparent 70%), var(--surface-2)',
            border: '1px solid var(--hair-2)',
          }}
        />
      </div>
    );
  if (i === 3)
    return (
      <div style={{ ...miniCard, alignItems: 'center', textAlign: 'center' }}>
        <div
          className="accent-text"
          style={{
            fontWeight: 700,
            fontSize: 20,
            fontFamily: 'var(--font-head)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          3.4×
        </div>
        <div style={bar('50%')} />
      </div>
    );
  if (i === 4)
    return (
      <div style={{ ...miniCard, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <svg viewBox="0 0 36 36" style={{ width: 34, height: 34, flexShrink: 0 }}>
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="var(--hair)"
            strokeWidth="5"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="5"
            strokeDasharray="62 26"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={bar('80%')} />
          <div style={bar('55%')} />
        </div>
      </div>
    );
  return (
    <div style={{ ...miniCard, alignItems: 'center', textAlign: 'center' }}>
      <div style={bar('46%')} />
      <div
        style={{
          padding: '4px 12px',
          borderRadius: 999,
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Ask us
      </div>
    </div>
  );
}

export default function PromptMovie() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const frozen = isStatic || !!reduce;

  const [chars, setChars] = useState(frozen ? PROMPT.length : 0);
  const [status, setStatus] = useState(frozen ? STATUSES.length - 1 : -1);
  const [minis, setMinis] = useState(frozen ? MINIS : 0);
  const [done, setDone] = useState(frozen);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (frozen) return;
    let alive = true;
    const T = timers.current;
    const run = () => {
      if (!alive) return;
      setChars(0);
      setStatus(-1);
      setMinis(0);
      setDone(false);
      for (let i = 1; i <= PROMPT.length; i++)
        T.push(window.setTimeout(() => setChars(i), 500 + i * 24));
      const t1 = 500 + PROMPT.length * 24 + 260;
      STATUSES.forEach((_, s) =>
        T.push(window.setTimeout(() => setStatus(s), t1 + s * 620))
      );
      const t2 = t1 + STATUSES.length * 620 + 140;
      for (let m = 1; m <= MINIS; m++)
        T.push(window.setTimeout(() => setMinis(m), t2 + m * 230));
      const t3 = t2 + MINIS * 230 + 320;
      T.push(window.setTimeout(() => setDone(true), t3));
      T.push(window.setTimeout(run, t3 + 3400));
    };
    run();
    return () => {
      alive = false;
      T.forEach(clearTimeout);
      T.length = 0;
    };
  }, [frozen]);

  return (
    <BrowserFrame url="bolt.new">
      <div
        style={{
          padding: 'clamp(14px, 2.4vw, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          textAlign: 'left',
        }}
      >
        {/* prompt bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--hair)',
            background: 'var(--surface)',
            minHeight: 46,
          }}
        >
          <span aria-hidden style={{ fontSize: 15 }}>
            ⚡
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(12px, 1.5vw, 14px)',
              color: 'var(--fg)',
              overflowWrap: 'anywhere',
            }}
          >
            {PROMPT.slice(0, chars)}
            {!frozen && chars < PROMPT.length && (
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                style={{ color: 'var(--primary)' }}
              >
                ▍
              </motion.span>
            )}
          </span>
        </div>

        {/* status + result zone (fixed-ish height so the loop doesn't jump) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="foot"
            style={{ minHeight: 18, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {status >= 0 && !done && (
              <>
                <motion.span
                  aria-hidden
                  animate={frozen ? undefined : { opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ color: 'var(--primary)' }}
                >
                  ●
                </motion.span>
                {STATUSES[status]}
              </>
            )}
            {done && (
              <motion.span
                initial={frozen ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: 'var(--primary)', fontWeight: 600 }}
              >
                ✓ Deck ready — 55 slides. You’re inside it: press → for the real thing.
              </motion.span>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(118px, 100%), 1fr))',
              gap: 10,
            }}
          >
            {Array.from({ length: MINIS }, (_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={
                  i < minis
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 16, scale: 0.94 }
                }
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              >
                <MiniSlide i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
