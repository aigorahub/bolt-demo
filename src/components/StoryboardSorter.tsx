import { useId, useState } from 'react';
import { Reorder } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* An embedded working prototype — a storyboard sorter. Drag the beats into a
   new order and the story arc redraws live: flat arcs bore rooms, so you
   drag until the energy rises into the ask. framer-motion's Reorder does the
   drag; the arc is plain SVG reading the tokens. No new dependencies. */

type Beat = { id: string; title: string; energy: number };

/* starts WRONG on purpose — the arc sags into pricing; drag the ask last */
const START: Beat[] = [
  { id: 'cover', title: 'Cover', energy: 5 },
  { id: 'demo', title: 'Live demo', energy: 9 },
  { id: 'problem', title: 'Problem', energy: 7 },
  { id: 'ask', title: 'The ask', energy: 8 },
  { id: 'proof', title: 'Proof', energy: 6 },
  { id: 'pricing', title: 'Pricing', energy: 3 },
];

export default function StoryboardSorter() {
  const { isStatic } = useDeck();
  const gid = useId();
  const [beats, setBeats] = useState<Beat[]>(START);

  const w = 300;
  const h = 130;
  const pts = beats.map(
    (b, i) =>
      [
        (i / (beats.length - 1)) * (w - 16) + 8,
        h - (b.energy / 10) * (h - 26) - 10,
      ] as const
  );
  const line = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ');
  const rising =
    beats[beats.length - 1].energy >= 8 &&
    beats[beats.length - 1].energy >= beats[beats.length - 2].energy;

  return (
    <div style={{ maxWidth: 820, marginInline: 'auto', width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(16px, 3vw, 30px)',
          alignItems: 'center',
        }}
      >
        <Reorder.Group
          axis="y"
          values={beats}
          onReorder={isStatic ? () => {} : setBeats}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          {beats.map((b, i) => (
            <Reorder.Item
              key={b.id}
              value={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--hair)',
                background: 'var(--surface-2)',
                cursor: isStatic ? 'default' : 'grab',
                userSelect: 'none',
              }}
              whileDrag={{
                scale: 1.03,
                boxShadow: 'var(--glow)',
                cursor: 'grabbing',
              }}
            >
              <span
                aria-hidden
                style={{
                  color: 'var(--fg-faint)',
                  fontSize: 13,
                  letterSpacing: 2,
                }}
              >
                ⠿
              </span>
              <span
                className="kicker accent-text"
                style={{ fontSize: 11, minWidth: 20 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontWeight: 600, fontSize: 14.5 }}>{b.title}</span>
              <span
                aria-label={`energy ${b.energy} of 10`}
                style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}
              >
                {Array.from({ length: 5 }, (_, k) => (
                  <span
                    key={k}
                    style={{
                      width: 6,
                      height: 14,
                      borderRadius: 2,
                      background:
                        k < Math.round(b.energy / 2)
                          ? 'var(--primary)'
                          : 'var(--surface-elevated)',
                    }}
                  />
                ))}
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: 150, display: 'block' }}
            aria-label="Story energy arc for the current order"
          >
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1="0"
              x2={w}
              y1={h - 1}
              y2={h - 1}
              stroke="var(--hair)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`}
              fill={`url(#${gid})`}
              style={{ transition: 'd 0.35s var(--ease)' }}
            />
            <path
              d={line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ transition: 'd 0.35s var(--ease)' }}
            />
            {pts.map((p, i) => (
              <circle
                key={beats[i].id}
                cx={p[0]}
                cy={p[1]}
                r={4}
                fill="var(--primary)"
                style={{ transition: 'cx 0.35s var(--ease), cy 0.35s var(--ease)' }}
              />
            ))}
          </svg>
          <p
            style={{
              margin: '8px 0 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: rising ? 'var(--fg)' : 'var(--fg-faint)',
              transition: 'color 0.3s',
            }}
          >
            {rising
              ? '↗ ends on a rising beat — rooms say yes to this shape'
              : 'the arc, live — drag beats until it rises into the ask'}
          </p>
        </div>
      </div>
    </div>
  );
}
