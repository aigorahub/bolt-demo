import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* The deck's one 3D moment for Part five: an EXPLODED DIAGRAM of this very
   repo, hand-built with CSS 3D transforms — no react-three-fiber, no deps.
   A slider pulls the five layers apart; hovering a legend row lights its
   layer. Restraint is the lesson: one strong 3D beat, doing explanatory
   work, not decoration. Because the engine mounts only the active slide,
   this costs nothing on the other 48. */

const LAYERS = [
  { name: 'Design tokens', path: 'src/styles/tokens.css', note: 'one :root block' },
  { name: 'Engine', path: 'src/deck/', note: 'locked — never edited' },
  { name: 'Component library', path: 'src/components/', note: '29 + your inventions' },
  { name: 'Your slides', path: 'src/App.tsx', note: 'authored fresh each deck' },
  { name: 'Deck chrome', path: 'dock · rail · presenter', note: 'free with the engine' },
];

export default function ExplodedStack() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [explode, setExplode] = useState(62);
  const [hi, setHi] = useState<number | null>(null);

  const gap = 12 + (explode / 100) * 58;

  return (
    <div style={{ maxWidth: 860, marginInline: 'auto', width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(16px, 3vw, 34px)',
          alignItems: 'center',
        }}
      >
        {/* the 3D pane */}
        <div>
          <div
            aria-hidden
            style={{
              height: 'clamp(220px, 30vh, 300px)',
              perspective: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'min(250px, 70%)',
                height: 160,
                transformStyle: 'preserve-3d',
                transform: 'rotateX(58deg) rotateZ(-32deg)',
              }}
            >
              {LAYERS.map((l, i) => {
                const lit = hi === i;
                return (
                  <div
                    key={l.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-sm)',
                      border: lit
                        ? '1px solid var(--line-accent)'
                        : '1px solid var(--hair)',
                      background: lit
                        ? 'var(--accent-soft)'
                        : i === 1
                          ? 'var(--surface-elevated)'
                          : 'var(--surface)',
                      boxShadow: lit ? 'var(--glow)' : 'none',
                      transform: `translateZ(${(i - 2) * gap}px)`,
                      transition: reduce
                        ? 'border-color 0.2s, background 0.2s'
                        : 'transform 0.5s var(--ease), border-color 0.2s, background 0.2s, box-shadow 0.3s',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        color: lit ? 'var(--fg)' : 'var(--fg-faint)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 6,
              paddingInline: 8,
            }}
          >
            <span className="kicker" style={{ whiteSpace: 'nowrap' }}>
              explode
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={explode}
              disabled={isStatic}
              aria-label="Explode the layer stack"
              onChange={(e) => setExplode(Number(e.target.value))}
              onKeyDown={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                accentColor: 'var(--primary)',
                cursor: isStatic ? 'default' : 'pointer',
              }}
            />
          </label>
        </div>

        {/* the legend — hover to light a layer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...LAYERS].reverse().map((l, ri) => {
            const i = LAYERS.length - 1 - ri;
            const lit = hi === i;
            return (
              <div
                key={l.name}
                onMouseEnter={() => setHi(i)}
                onMouseLeave={() => setHi(null)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: lit
                    ? '1px solid var(--line-accent)'
                    : '1px solid var(--hair-2)',
                  background: lit ? 'var(--accent-soft)' : 'var(--surface)',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'default',
                }}
              >
                <span
                  className="kicker accent-text"
                  style={{ fontSize: 11, flexShrink: 0 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{l.name}</span>
                <span
                  className="hide-narrow"
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                  }}
                >
                  {l.path}
                </span>
              </div>
            );
          })}
          <p
            style={{
              margin: '6px 2px 0',
              fontSize: 12.5,
              color: 'var(--fg-faint)',
            }}
          >
            CSS 3D, zero dependencies — and it mounts only while this slide is
            live.
          </p>
        </div>
      </div>
    </div>
  );
}
