import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* Auto-pressing key row that cycles the real deck shortcuts so the room
   memorizes them without a lecture. Click a key to jump the sequence. */
const KEYS: { key: string; label: string; hint: string }[] = [
  { key: 'G', label: 'Grid', hint: 'Every slide at once' },
  { key: 'S', label: 'Sidebar', hint: 'Thumbnail rail' },
  { key: 'A', label: 'Annotate', hint: 'Pen · shapes · ink' },
  { key: 'P', label: 'Present', hint: 'Synced second tab' },
  { key: 'F', label: 'Full', hint: 'Browser fullscreen' },
  { key: 'H', label: 'Hide', hint: 'Chrome vanishes' },
];

export default function KeycapDemo() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (isStatic || reduce) return;
    let pressTimer: number | undefined;
    const id = window.setInterval(() => {
      setPressed(true);
      pressTimer = window.setTimeout(() => {
        setPressed(false);
        setActive((i) => (i + 1) % KEYS.length);
      }, 220);
    }, 1400);
    return () => {
      clearInterval(id);
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [isStatic, reduce]);

  const cur = KEYS[active];

  return (
    <div
      style={{
        maxWidth: 820,
        marginInline: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {KEYS.map((k, i) => {
          const on = i === active;
          const down = on && pressed && !isStatic && !reduce;
          return (
            <button
              key={k.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
                setPressed(true);
                window.setTimeout(() => setPressed(false), 180);
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
              }}
              aria-pressed={on}
              style={{
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                perspective: 600,
              }}
            >
              <motion.div
                animate={{
                  y: down ? 4 : 0,
                  scale: down ? 0.97 : on ? 1.04 : 1,
                }}
                transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 26,
                  fontWeight: 700,
                  color: on ? 'var(--accent-ink)' : 'var(--fg)',
                  background: on ? 'var(--accent)' : 'var(--surface)',
                  border: `1px solid ${on ? 'transparent' : 'var(--hair)'}`,
                  boxShadow: down
                    ? '0 1px 0 var(--hair-2)'
                    : on
                      ? 'var(--shadow-md), 0 0 0 1px color-mix(in srgb, var(--primary) 35%, transparent)'
                      : '0 6px 0 color-mix(in srgb, var(--fg) 8%, transparent), var(--shadow-sm)',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {k.key}
              </motion.div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          textAlign: 'center',
          minHeight: 72,
        }}
      >
        <motion.div
          key={cur.key}
          initial={isStatic || reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div
            className="kicker accent-text"
            style={{ marginBottom: 8, letterSpacing: 0.12 }}
          >
            press {cur.key}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(28px,4vw,40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            {cur.label}
          </div>
          <p
            style={{
              margin: '8px 0 0',
              color: 'var(--fg-muted)',
              fontSize: 16,
            }}
          >
            {cur.hint}
          </p>
        </motion.div>
      </div>

      <p className="foot" style={{ margin: 0, textAlign: 'center' }}>
        Keys auto-cycle · click any key to hold it · try the real ones on your keyboard
      </p>
    </div>
  );
}
