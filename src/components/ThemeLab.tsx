import { useState } from 'react';
import { useDeck } from '../deck/DeckContext';

/* An interactive theme lab: swap the deck's :root tokens at runtime to prove
   the whole app — chrome included — reads from one token block. Each preset
   is a full token set; "Bolt" clears the overrides and falls back to
   tokens.css. The change sticks as you keep navigating: that's the point.
   Follows the extend-the-system rules: tokens only, responsive, no deps. */
type Preset = {
  name: string;
  tag: string;
  dots: [string, string, string];
  colorScheme: 'dark' | 'light';
  vars: Record<string, string>;
};

const PRESETS: Preset[] = [
  {
    name: 'Bolt',
    tag: 'Electric indigo · the default',
    dots: ['#05060c', '#7c9bff', '#b47bff'],
    colorScheme: 'dark',
    vars: {},
  },
  {
    name: 'Reactor',
    tag: 'Emerald product dark',
    dots: ['#05070a', '#4fe5b0', '#c8f56e'],
    colorScheme: 'dark',
    vars: {
      '--bg': '#05070a',
      '--bg-grad-1': 'rgba(79, 229, 176, 0.12)',
      '--bg-grad-2': 'rgba(41, 192, 240, 0.08)',
      '--fg': '#f4f7fa',
      '--fg-muted': '#9aa4b2',
      '--fg-faint': '#626d7d',
      '--hair': 'rgba(255, 255, 255, 0.1)',
      '--hair-2': 'rgba(255, 255, 255, 0.06)',
      '--primary': '#4fe5b0',
      '--accent':
        'linear-gradient(115deg, #c8f56e 0%, #5aeeb0 42%, #34dcd8 74%, #29c0f0 100%)',
      '--accent-ink': '#04140e',
      '--glow': '0 30px 80px -40px rgba(79, 229, 176, 0.5)',
      '--font-head':
        "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    },
  },
  {
    name: 'Signal',
    tag: 'Magenta cinematic',
    dots: ['#0a0509', '#ff5c8a', '#ff9166'],
    colorScheme: 'dark',
    vars: {
      '--bg': '#0a0509',
      '--bg-grad-1': 'rgba(255, 92, 138, 0.13)',
      '--bg-grad-2': 'rgba(255, 79, 216, 0.08)',
      '--fg': '#fff3f6',
      '--fg-muted': '#b39aa6',
      '--fg-faint': '#75606a',
      '--hair': 'rgba(255, 170, 200, 0.13)',
      '--hair-2': 'rgba(255, 170, 200, 0.07)',
      '--primary': '#ff5c8a',
      '--accent':
        'linear-gradient(115deg, #ff9166 0%, #ff6a6e 30%, #ff5c8a 62%, #ff4fd8 100%)',
      '--accent-ink': '#22030f',
      '--glow': '0 30px 90px -40px rgba(255, 92, 138, 0.5)',
    },
  },
  {
    name: 'Paper',
    tag: 'Light editorial serif',
    dots: ['#f5f1e8', '#b3400e', '#d97706'],
    colorScheme: 'light',
    vars: {
      '--bg': '#f5f1e8',
      '--bg-grad-1': 'rgba(217, 119, 6, 0.12)',
      '--bg-grad-2': 'rgba(179, 64, 14, 0.07)',
      '--surface': 'rgba(34, 28, 20, 0.05)',
      '--surface-2': 'rgba(34, 28, 20, 0.08)',
      '--fg': '#221c14',
      '--fg-muted': '#6b6152',
      '--fg-faint': '#a89d8a',
      '--hair': 'rgba(34, 28, 20, 0.16)',
      '--hair-2': 'rgba(34, 28, 20, 0.09)',
      '--primary': '#b3400e',
      '--accent':
        'linear-gradient(115deg, #d97706 0%, #ea580c 45%, #b3400e 100%)',
      '--accent-ink': '#fff8ec',
      '--glow': '0 30px 80px -45px rgba(217, 119, 6, 0.4)',
      '--shadow': '0 40px 90px -48px rgba(34, 28, 20, 0.4)',
      '--vignette': 'rgba(120, 90, 40, 0.1)',
      '--grain': '0.05',
      '--font-head': "'Fraunces', 'Iowan Old Style', Georgia, serif",
    },
  },
];

const ALL_KEYS = Array.from(
  new Set(PRESETS.flatMap((p) => Object.keys(p.vars)))
);

export default function ThemeLab() {
  const { isStatic } = useDeck();
  const [active, setActive] = useState(0);
  const [primaryVal, setPrimaryVal] = useState('#7c9bff');

  const apply = (i: number) => {
    const root = document.documentElement;
    for (const k of ALL_KEYS) root.style.removeProperty(k);
    for (const [k, v] of Object.entries(PRESETS[i].vars))
      root.style.setProperty(k, v);
    if (PRESETS[i].colorScheme === 'light') root.style.colorScheme = 'light';
    else root.style.removeProperty('color-scheme');
    setActive(i);
    requestAnimationFrame(() =>
      setPrimaryVal(
        getComputedStyle(root).getPropertyValue('--primary').trim()
      )
    );
  };

  return (
    <div style={{ maxWidth: 880, marginInline: 'auto', width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(190px, 100%), 1fr))',
          gap: 14,
        }}
      >
        {PRESETS.map((p, i) => (
          <button
            key={p.name}
            onClick={isStatic ? undefined : () => apply(i)}
            onKeyDown={(e) => {
              // don't let Enter/Space page the deck while picking a theme
              if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
            }}
            aria-pressed={active === i}
            style={{
              font: 'inherit',
              color: 'inherit',
              textAlign: 'left',
              padding: '18px 18px 16px',
              borderRadius: 'var(--radius)',
              cursor: isStatic ? 'default' : 'pointer',
              background: active === i ? 'var(--surface-2)' : 'var(--surface)',
              border:
                active === i
                  ? '1px solid var(--primary)'
                  : '1px solid var(--hair)',
              boxShadow: active === i ? 'var(--glow)' : 'none',
              transition:
                'border-color 0.3s, box-shadow 0.3s, background 0.3s',
            }}
          >
            <span
              style={{
                display: 'flex',
                gap: 6,
                marginBottom: 12,
              }}
              aria-hidden
            >
              {p.dots.map((d, k) => (
                <span
                  key={k}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: d,
                    border: '1px solid var(--hair)',
                  }}
                />
              ))}
            </span>
            <span
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 3,
              }}
            >
              {p.name}
              {active === i && (
                <span className="accent-text" style={{ marginLeft: 8 }}>
                  ✓
                </span>
              )}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 13,
                color: 'var(--fg-muted)',
                lineHeight: 1.4,
              }}
            >
              {p.tag}
            </span>
          </button>
        ))}
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
        --primary: {primaryVal} · the dock is listening too
      </p>
    </div>
  );
}
