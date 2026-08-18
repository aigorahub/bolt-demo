import { useId, useState } from 'react';
import { useDeck } from '../deck/DeckContext';

/* A parameter explorer — the interactivity pattern that lands hardest:
   a claim the audience can poke. Two sliders drive a compounding model;
   the chart and the figure redraw on every tick. The chart is live SVG
   themed from the tokens (no library palette, no library at all), and
   redrawing is a pure recompute — no animation needed, so it's already
   reduced-motion safe. */

function series(rate: number, weeks: number): number[] {
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i <= weeks; i++) {
    out.push(v);
    v *= 1 + rate / 100;
  }
  return out;
}

const fmt = (n: number) =>
  n >= 10000
    ? `${(n / 1000).toFixed(1)}k`
    : n.toLocaleString('en-US', { maximumFractionDigits: 0 });

function Param({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: '1 1 210px',
      }}
    >
      <span
        className="kicker"
        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          minWidth: 80,
          accentColor: 'var(--primary)',
          cursor: disabled ? 'default' : 'pointer',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 52,
          textAlign: 'right',
        }}
      >
        {value}
        {suffix}
      </span>
    </label>
  );
}

export default function ParamExplorer() {
  const { isStatic } = useDeck();
  const gid = useId();
  const [rate, setRate] = useState(6);
  const [weeks, setWeeks] = useState(26);

  const data = series(rate, weeks);
  const final = data[data.length - 1];
  const w = 300;
  const h = 110;
  const max = Math.max(...data);
  const pts = data.map(
    (v, i) =>
      [(i / (data.length - 1)) * w, h - (v / max) * (h - 12) - 4] as const
  );
  const line = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;

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
            gap: 'clamp(14px, 3vw, 30px)',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Param
            label="Growth"
            value={rate}
            min={1}
            max={20}
            suffix="%/wk"
            onChange={setRate}
            disabled={isStatic}
          />
          <Param
            label="Horizon"
            value={weeks}
            min={4}
            max={52}
            suffix=" wk"
            onChange={setWeeks}
            disabled={isStatic}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 18,
            alignItems: 'end',
          }}
        >
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: 130, display: 'block' }}
            aria-label={`Compounding curve: ${rate}% weekly for ${weeks} weeks`}
          >
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1="0"
                x2={w}
                y1={4 + (h - 12) * f}
                y2={4 + (h - 12) * f}
                stroke="var(--hair-2)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={area} fill={`url(#${gid})`} />
            <path
              d={line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={pts[pts.length - 1][0]}
              cy={pts[pts.length - 1][1]}
              r={4}
              fill="var(--primary)"
            />
          </svg>

          <div style={{ textAlign: 'center', paddingBottom: 6 }}>
            <div
              className="figure"
              style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}
            >
              {fmt(final)}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              from 100, after {weeks} weeks at {rate}%
            </div>
          </div>
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
        a model, not a promise — which is exactly why the room gets the sliders
      </p>
    </div>
  );
}
