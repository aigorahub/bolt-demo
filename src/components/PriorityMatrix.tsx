import { useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* A workshop tool ON a slide: drag backlog items around an impact × effort
   matrix and the quadrant tallies re-count. This is the "run the meeting
   inside the deck" pattern — the slide is the whiteboard, and the state is
   yours to rearrange mid-talk. framer-motion drag + layoutId, tokens only. */

type Quad = 0 | 1 | 2 | 3; // 0 do-now · 1 plan · 2 nice · 3 skip

const QUADS: { name: string; hint: string }[] = [
  { name: 'Do now', hint: 'high impact · low effort' },
  { name: 'Plan', hint: 'high impact · high effort' },
  { name: 'Nice', hint: 'low impact · low effort' },
  { name: 'Skip', hint: 'low impact · high effort' },
];

const CHIPS: { id: string; label: string; start: Quad }[] = [
  { id: 'live-data', label: 'Live data tile', start: 0 },
  { id: '3d', label: 'One 3D moment', start: 1 },
  { id: 'retheme', label: 'Brand re-theme', start: 2 },
  { id: 'explorer', label: 'Parameter explorer', start: 2 },
  { id: 'bullets', label: 'More bullets', start: 0 },
  { id: 'notes', label: 'Timing cues in notes', start: 3 },
];

export default function PriorityMatrix() {
  const { isStatic } = useDeck();
  const gridRef = useRef<HTMLDivElement>(null);
  const [where, setWhere] = useState<Record<string, Quad>>(() =>
    Object.fromEntries(CHIPS.map((c) => [c.id, c.start]))
  );

  const drop = (id: string, x: number, y: number) => {
    const el = gridRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;
    const q = ((y > r.top + r.height / 2 ? 2 : 0) +
      (x > r.left + r.width / 2 ? 1 : 0)) as Quad;
    setWhere((w) => (w[id] === q ? w : { ...w, [id]: q }));
  };

  return (
    <div style={{ maxWidth: 760, marginInline: 'auto', width: '100%' }}>
      <LayoutGroup>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(2, minmax(clamp(108px, 16vh, 150px), auto))',
            gap: 8,
          }}
        >
          {QUADS.map((q, qi) => {
            const chips = CHIPS.filter((c) => where[c.id] === qi);
            return (
              <div
                key={q.name}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border:
                    qi === 0
                      ? '1px solid var(--line-accent)'
                      : '1px dashed var(--hair)',
                  background: qi === 0 ? 'var(--accent-soft)' : 'var(--surface)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {q.name}
                  </span>
                  <span
                    className="hide-narrow"
                    style={{ fontSize: 11, color: 'var(--fg-faint)' }}
                  >
                    {q.hint}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--fg-muted)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {chips.length}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    alignContent: 'flex-start',
                  }}
                >
                  {chips.map((c) => (
                    <motion.div
                      key={c.id}
                      layoutId={`pm-${c.id}`}
                      drag={!isStatic}
                      dragSnapToOrigin
                      dragElastic={0.2}
                      dragMomentum={false}
                      whileDrag={{ scale: 1.06, zIndex: 5, boxShadow: 'var(--glow)' }}
                      onDragEnd={(_, info) => drop(c.id, info.point.x, info.point.y)}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: 999,
                        border: '1px solid var(--hair)',
                        background: 'var(--surface-elevated)',
                        cursor: isStatic ? 'default' : 'grab',
                        userSelect: 'none',
                        touchAction: 'none',
                        whiteSpace: 'nowrap',
                        position: 'relative',
                      }}
                    >
                      {c.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          color: 'var(--fg-faint)',
        }}
      >
        <span>impact ↑ · effort →</span>
        <span>drag the chips — the room decides, live</span>
      </div>
    </div>
  );
}
