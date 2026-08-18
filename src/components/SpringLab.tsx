import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* A spring playground: tune stiffness and damping with sliders, hit replay,
   and FEEL the difference — with the exact transition prop printed below so
   the audience leaves with working code. Parameter explorer × motion
   education in one toy. Tokens only, reduced-motion safe, no deps. */

function LabSlider({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: '1 1 200px',
      }}
    >
      <span className="kicker" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
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
          minWidth: 70,
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
          minWidth: 36,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </label>
  );
}

export default function SpringLab() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const [stiffness, setStiffness] = useState(170);
  const [damping, setDamping] = useState(14);
  const [run, setRun] = useState(0);

  return (
    <div style={{ maxWidth: 760, marginInline: 'auto', width: '100%' }}>
      <div
        style={{
          padding: 'clamp(18px, 3vw, 26px)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
          border: '1px solid var(--hair)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'clamp(14px, 3vw, 28px)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <LabSlider
            label="Stiffness"
            value={stiffness}
            min={40}
            max={600}
            onChange={setStiffness}
            disabled={isStatic}
          />
          <LabSlider
            label="Damping"
            value={damping}
            min={4}
            max={60}
            onChange={setDamping}
            disabled={isStatic}
          />
          <button
            onClick={isStatic ? undefined : () => setRun((r) => r + 1)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
            }}
            style={{
              font: 'inherit',
              fontSize: 13.5,
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              cursor: isStatic ? 'default' : 'pointer',
              flexShrink: 0,
            }}
          >
            Replay
          </button>
        </div>

        {/* the runway */}
        <div
          style={{
            position: 'relative',
            marginTop: 20,
            height: 88,
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--hair)',
            background: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '12%',
              width: 1,
              background: 'var(--line-accent)',
            }}
          />
          <motion.div
            key={run}
            initial={reduce || isStatic ? false : { left: '4%' }}
            animate={{ left: '76%' }}
            transition={
              reduce ? { duration: 0 } : { type: 'spring', stiffness, damping }
            }
            style={{
              position: 'absolute',
              top: '50%',
              translateY: '-50%',
              width: 'clamp(56px, 12vw, 96px)',
              height: 56,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              boxShadow: 'var(--glow)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--accent-ink)',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            spring
          </motion.div>
        </div>

        <pre
          style={{
            margin: '16px 0 0',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hair-2)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(11px, 1.6vw, 13px)',
            color: 'var(--fg-muted)',
            overflowX: 'auto',
          }}
        >
          {`transition={{ type: 'spring', stiffness: ${stiffness}, damping: ${damping} }}`}
        </pre>
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
        tune it until it feels like the brand — then copy the line home
      </p>
    </div>
  );
}
