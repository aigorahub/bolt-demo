import { useState } from 'react';
import { useDeck } from '../deck/DeckContext';
import BrowserFrame from './BrowserFrame';
import CountUp from './CountUp';
import { BarChart, LineChart } from './Charts';

/* A working product inside a slide: a small analytics app with period and
   region controls that actually change the data. The charts are the deck's
   own BarChart/LineChart, re-keyed so they replay their draw-in on every
   click. Deterministic fake data (it's a demo app, not a real product) —
   the point is that the slide RUNS, not what it reports. */
const PERIODS = ['7d', '30d', '90d'] as const;
const REGIONS = ['All', 'NA', 'EMEA', 'APAC'] as const;

/* deterministic pseudo-data so every visit looks the same */
function series(p: number, r: number, n: number, lo: number, hi: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = Math.sin((i + 1) * (1.7 + p * 0.9) + r * 2.3) * 0.5 + 0.5;
    const g = i / (n - 1);
    out.push(Math.round(lo + (hi - lo) * (0.25 + 0.45 * t + 0.3 * g)));
  }
  return out;
}

const seg = (active: boolean): React.CSSProperties => ({
  font: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  padding: '6px 14px',
  borderRadius: 999,
  cursor: 'pointer',
  border: '1px solid ' + (active ? 'transparent' : 'var(--hair)'),
  background: active ? 'var(--accent)' : 'transparent',
  color: active ? 'var(--accent-ink)' : 'var(--fg-muted)',
  transition: 'background 0.25s, color 0.25s',
});

export default function LiveApp() {
  const { isStatic } = useDeck();
  const [p, setP] = useState(1);
  const [r, setR] = useState(0);

  const bars = series(p, r, 6, 18, 96);
  const line = series(p + 2, r, 8, 10, 48);
  const rev = 0.6 + bars.reduce((a, b) => a + b, 0) / 100;
  const users = 12 + line.reduce((a, b) => a + b, 0);
  const conv = 2.1 + ((p * 3 + r * 2) % 5) * 0.4;

  const stopKeys = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
  };

  return (
    <BrowserFrame url="acme.app/overview">
      <div
        style={{
          padding: 'clamp(12px, 2vw, 20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          textAlign: 'left',
        }}
      >
        {/* controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Period">
            {PERIODS.map((label, i) => (
              <button
                key={label}
                style={seg(p === i)}
                onClick={isStatic ? undefined : () => setP(i)}
                onKeyDown={stopKeys}
                aria-pressed={p === i}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="hide-narrow"
            style={{ display: 'flex', gap: 6 }}
            role="group"
            aria-label="Region"
          >
            {REGIONS.map((label, i) => (
              <button
                key={label}
                style={seg(r === i)}
                onClick={isStatic ? undefined : () => setR(i)}
                onKeyDown={stopKeys}
                aria-pressed={r === i}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))',
            gap: 10,
          }}
        >
          {[
            {
              label: 'Revenue',
              node: (
                <CountUp
                  key={`rev-${p}-${r}`}
                  to={rev}
                  decimals={2}
                  prefix="$"
                  suffix="M"
                  duration={0.7}
                />
              ),
            },
            {
              label: 'Active users',
              node: (
                <CountUp key={`u-${p}-${r}`} to={users} suffix="k" duration={0.7} />
              ),
            },
            {
              label: 'Conversion',
              node: (
                <CountUp
                  key={`c-${p}-${r}`}
                  to={conv}
                  decimals={1}
                  suffix="%"
                  duration={0.7}
                />
              ),
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair)',
                background: 'var(--surface)',
              }}
            >
              <div className="foot" style={{ marginBottom: 4 }}>
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 'clamp(17px, 2vw, 22px)',
                  fontWeight: 650,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.node}
              </div>
            </div>
          ))}
        </div>

        {/* charts re-key on every click so the draw-in replays */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--hair)',
              background: 'var(--surface)',
            }}
          >
            <div className="foot" style={{ marginBottom: 10 }}>
              Signups · {PERIODS[p]} · {REGIONS[r]}
            </div>
            <div style={{ height: 110 }}>
              <BarChart
                key={`b-${p}-${r}`}
                height={110}
                data={bars.map((v, i) => ({ label: `W${i + 1}`, value: v }))}
              />
            </div>
          </div>
          <div
            className="hide-narrow"
            style={{
              padding: 14,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--hair)',
              background: 'var(--surface)',
            }}
          >
            <div className="foot" style={{ marginBottom: 10 }}>
              Revenue trend
            </div>
            <LineChart key={`l-${p}-${r}`} points={line} height={110} />
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
