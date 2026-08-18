import { useState } from 'react';
import { useDeck } from '../deck/DeckContext';

/* Theming, level 2: ONE primitive, everything else derived. The slider
   rewrites --primary (and the accent gradient built from it) at runtime;
   the swatch strip below shows the SEMANTIC layer from tokens.css —
   color-mix() recipes that follow automatically. Same extend-the-system
   rules as ThemeLab: tokens only, responsive, reduced-motion safe, no deps. */

const DEFAULT_HUE = 265; // oklch hue of the stock #7c9bff-ish indigo

/* the :root overrides outlive this slide (that's the demo), so the slider
   position must too — otherwise revisiting shows a dial that disagrees
   with the live theme */
let lastHue = DEFAULT_HUE;

const HUE_KEYS = [
  '--primary',
  '--accent',
  '--accent-ink',
  '--bg-grad-1',
  '--bg-grad-2',
  '--glow',
];

const RECIPES: { name: string; recipe: string; css: string }[] = [
  { name: 'primary', recipe: 'the one primitive', css: 'var(--primary)' },
  {
    name: 'accent-soft',
    recipe: 'primary 16% → transparent',
    css: 'var(--accent-soft)',
  },
  {
    name: 'accent-strong',
    recipe: 'primary 72% → fg',
    css: 'var(--accent-strong)',
  },
  {
    name: 'line-accent',
    recipe: 'primary 45% → transparent',
    css: 'var(--line-accent)',
  },
  {
    name: 'surface-elevated',
    recipe: 'fg 9% → transparent',
    css: 'var(--surface-elevated)',
  },
];

function applyHue(h: number) {
  const root = document.documentElement;
  if (h === DEFAULT_HUE) {
    for (const k of HUE_KEYS) root.style.removeProperty(k);
    return;
  }
  const primary = `oklch(0.74 0.14 ${h})`;
  root.style.setProperty('--primary', primary);
  root.style.setProperty(
    '--accent',
    `linear-gradient(115deg, oklch(0.82 0.12 ${h - 35}) 0%, oklch(0.74 0.15 ${h}) 55%, oklch(0.66 0.17 ${h + 40}) 100%)`
  );
  root.style.setProperty('--accent-ink', `oklch(0.16 0.05 ${h})`);
  root.style.setProperty(
    '--bg-grad-1',
    `color-mix(in srgb, ${primary} 13%, transparent)`
  );
  root.style.setProperty(
    '--bg-grad-2',
    `color-mix(in srgb, oklch(0.7 0.15 ${h + 40}) 9%, transparent)`
  );
  root.style.setProperty(
    '--glow',
    `0 30px 90px -40px color-mix(in srgb, ${primary} 55%, transparent)`
  );
}

export default function HueDial() {
  const { isStatic } = useDeck();
  const [hue, setHueState] = useState(() => lastHue);
  const setHue = (h: number) => {
    lastHue = h;
    setHueState(h);
  };
  const dirty = hue !== DEFAULT_HUE;

  return (
    <div style={{ maxWidth: 780, marginInline: 'auto', width: '100%' }}>
      <div
        style={{
          padding: 'clamp(18px, 3vw, 28px)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
          border: '1px solid var(--hair)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <span
            className="kicker"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            --primary hue
          </span>
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            disabled={isStatic}
            aria-label="Primary hue"
            onChange={(e) => {
              const h = Number(e.target.value);
              setHue(h);
              applyHue(h);
            }}
            onKeyDown={(e) => e.stopPropagation()} /* arrows tune, not page */
            style={{
              flex: '1 1 180px',
              accentColor: 'var(--primary)',
              cursor: isStatic ? 'default' : 'pointer',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--fg-muted)',
              fontVariantNumeric: 'tabular-nums',
              minWidth: 42,
              textAlign: 'right',
            }}
          >
            {hue}°
          </span>
          <button
            onClick={
              isStatic
                ? undefined
                : () => {
                    setHue(DEFAULT_HUE);
                    applyHue(DEFAULT_HUE);
                  }
            }
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
            }}
            style={{
              font: 'inherit',
              fontSize: 13,
              color: dirty ? 'var(--fg)' : 'var(--fg-faint)',
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid var(--hair)',
              background: dirty ? 'var(--surface-elevated)' : 'transparent',
              cursor: isStatic || !dirty ? 'default' : 'pointer',
              transition: 'color 0.3s, background 0.3s',
            }}
          >
            reset
          </button>
        </div>

        {/* the semantic layer, watching the primitive */}
        <div
          style={{
            marginTop: 20,
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(122px, 100%), 1fr))',
            gap: 10,
          }}
        >
          {RECIPES.map((s) => (
            <div
              key={s.name}
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair)',
                overflow: 'hidden',
                background: 'var(--surface)',
              }}
            >
              <div
                aria-hidden
                style={{
                  height: 44,
                  background: s.css,
                  borderBottom: '1px solid var(--hair-2)',
                }}
              />
              <div style={{ padding: '8px 10px 10px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    lineHeight: 1.35,
                  }}
                >
                  {s.recipe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p
        style={{
          textAlign: 'center',
          marginTop: 12,
          marginBottom: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-faint)',
        }}
      >
        one hand-picked value · four color-mix() derivations · zero drift
      </p>
    </div>
  );
}
