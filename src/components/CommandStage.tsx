import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* A live command palette inside a slide. Type to filter "actions"; Enter
   runs a visual result. Stops key propagation so typing doesn't advance slides. */
const ACTIONS = [
  { id: 'theme', kicker: 'theme', title: 'Re-theme to Paper', result: 'Tokens flipped — try Theme Lab a few slides out for real.' },
  { id: 'grid', kicker: 'view', title: 'Open grid overview', result: 'Press G on your keyboard — every slide at once.' },
  { id: 'ink', kicker: 'tool', title: 'Start annotating', result: 'Press A — pen, highlighter, shapes, eraser.' },
  { id: 'present', kicker: 'mode', title: 'Open presenter tab', result: 'Press P — timer, notes, next slide, synced.' },
  { id: 'build', kicker: 'nav', title: 'Step through builds', result: '→ reveals; ← rewinds. Builds are first-class navigation.' },
  { id: 'share', kicker: 'ship', title: 'Copy share link', result: 'URL hash tracks the slide — send /#12, land on 12.' },
  { id: 'agent', kicker: 'agent', title: 'Prompt a new deck', result: 'Open the skill. One sentence in → full app out.' },
  { id: 'custom', kicker: 'extend', title: 'Add a custom component', result: 'Floor, not ceiling. Tokens only. Zero new deps.' },
];

export default function CommandStage() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState<string | null>(
    isStatic ? ACTIONS[0].result : null
  );
  const [typedDemo, setTypedDemo] = useState(isStatic || !!reduce ? 'theme' : '');

  const query = q || typedDemo;

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return ACTIONS;
    return ACTIONS.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.kicker.toLowerCase().includes(s) ||
        a.id.includes(s)
    );
  }, [query]);

  useEffect(() => {
    setIdx(0);
  }, [query]);

  /* type a demo query once so the palette looks alive without interaction */
  useEffect(() => {
    if (isStatic || reduce || q) return;
    const target = 'present';
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedDemo(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [isStatic, reduce, q]);

  const run = (id: string) => {
    const a = ACTIONS.find((x) => x.id === id);
    if (!a) return;
    setFlash(a.result);
  };

  const active = list[idx] ?? list[0];

  return (
    <div
      style={{
        maxWidth: 640,
        marginInline: 'auto',
        width: '100%',
        display: 'grid',
        gap: 16,
      }}
    >
      <div
        style={{
          borderRadius: 'var(--radius)',
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid var(--hair-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--fg-faint)',
            }}
          >
            ⌘K
          </span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setTypedDemo('');
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setIdx((i) => Math.min(list.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setIdx((i) => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && active) {
                e.preventDefault();
                run(active.id);
              } else if (e.key === 'Escape') {
                setQ('');
                setTypedDemo('');
              }
            }}
            placeholder="Jump, theme, annotate, present…"
            aria-label="Command palette filter"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--fg)',
              font: 'inherit',
              fontSize: 16,
            }}
          />
          <span className="foot" style={{ margin: 0 }}>
            {list.length}
          </span>
        </div>

        <div style={{ maxHeight: 280, overflow: 'auto', padding: 8 }}>
          {list.length === 0 && (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--fg-muted)',
                fontSize: 14,
              }}
            >
              Nothing matches — try “theme” or “ink”.
            </div>
          )}
          {list.map((a, i) => {
            const on = i === idx;
            return (
              <button
                key={a.id}
                type="button"
                onMouseEnter={() => setIdx(i)}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                  run(a.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 12px',
                  background: on
                    ? 'color-mix(in srgb, var(--primary) 16%, var(--surface-2))'
                    : 'transparent',
                }}
              >
                <span
                  className="kicker"
                  style={{
                    margin: 0,
                    minWidth: 56,
                    color: on ? 'var(--primary)' : 'var(--fg-faint)',
                  }}
                >
                  {a.kicker}
                </span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{a.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={flash ?? 'idle'}
        initial={isStatic || reduce || !flash ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          minHeight: 48,
          textAlign: 'center',
          color: flash ? 'var(--fg)' : 'var(--fg-muted)',
          fontSize: 15,
          lineHeight: 1.5,
          padding: '0 8px',
        }}
      >
        {flash ?? 'Type to filter · ↑↓ to move · Enter to run'}
      </motion.div>
    </div>
  );
}
