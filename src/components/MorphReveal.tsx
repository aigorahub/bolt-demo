import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeck } from '../deck/DeckContext';

/* Drag-to-compare: left is dead slideware (bullets, clipped canvas), right is a
   live mini-deck. Same idea as a photo before/after, but the "after" runs. */
export default function MorphReveal() {
  const { isStatic } = useDeck();
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(isStatic || reduce ? 58 : 42);
  const drag = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    const next = ((clientX - r.left) / r.width) * 100;
    setPct(Math.min(92, Math.max(8, next)));
  }, []);

  useEffect(() => {
    if (isStatic || reduce) return;
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      setFromX(e.clientX);
    };
    const onUp = () => {
      drag.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isStatic, reduce, setFromX]);

  /* auto-breathe the handle so the room notices without a demo script */
  useEffect(() => {
    if (isStatic || reduce) return;
    let t = 0;
    let id = 0;
    let paused = false;
    const tick = () => {
      t += 0.016;
      if (!paused && !drag.current) {
        const wave = 42 + Math.sin(t * 0.55) * 14;
        setPct(wave);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    const el = frame.current;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    el?.addEventListener('pointerdown', pause);
    el?.addEventListener('pointerleave', resume);
    return () => {
      cancelAnimationFrame(id);
      el?.removeEventListener('pointerdown', pause);
      el?.removeEventListener('pointerleave', resume);
    };
  }, [isStatic, reduce]);

  return (
    <div
      ref={frame}
      role="img"
      aria-label="Drag to compare a static slide with a live deck slide"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 880,
        marginInline: 'auto',
        aspectRatio: '16 / 10',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--hair)',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* AFTER (live) — full underlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <LiveFace />
      </div>

      {/* BEFORE (dead) — same full size, clip-path so both sides stay aligned */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          borderRight: '1px solid color-mix(in srgb, var(--primary) 55%, transparent)',
        }}
      >
        <DeadFace />
      </div>

      {/* Handle */}
      <div
        onPointerDown={(e) => {
          drag.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromX(e.clientX);
        }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${pct}%`,
          width: 28,
          transform: 'translateX(-50%)',
          cursor: 'ew-resize',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 3,
            height: '100%',
            background:
              'linear-gradient(180deg, transparent, color-mix(in srgb, var(--primary) 80%, white), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            borderRadius: 999,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          ⇄
        </div>
      </div>

      <Badge side="left" active={pct > 28}>
        final_v7.pptx
      </Badge>
      <Badge side="right" active={pct < 72}>
        live app · this deck
      </Badge>
    </div>
  );
}

function Badge({
  side,
  children,
  active,
}: {
  side: 'left' | 'right';
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        [side]: 14,
        zIndex: 2,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.04,
        textTransform: 'uppercase',
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid var(--hair)',
        background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
        color: active ? 'var(--fg)' : 'var(--fg-faint)',
        backdropFilter: 'blur(8px)',
        transition: 'color 0.2s',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
}

function DeadFace() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        padding: 'clamp(28px,5%,48px)',
        background:
          'linear-gradient(160deg, #1a1d24 0%, #12141a 60%, #0e1015 100%)',
        color: '#c8cdd6',
        fontFamily: 'Arial, Helvetica, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.55 }}>
        Q3 All-Hands
      </div>
      <div style={{ fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 700, color: '#eef1f6' }}>
        Our Strategy Going Forward
      </div>
      <ul
        style={{
          margin: '8px 0 0',
          paddingLeft: 22,
          fontSize: 18,
          lineHeight: 1.75,
          opacity: 0.85,
        }}
      >
        <li>Synergize cross-functional OKRs across the org</li>
        <li>Leverage AI to drive 10x productivity gains</li>
        <li>Double down on our north-star metrics</li>
        <li>Align stakeholders on the roadmap</li>
        <li style={{ opacity: 0.45 }}>…and 11 more bullets below the fold</li>
      </ul>
      <div
        style={{
          marginTop: 'auto',
          fontSize: 12,
          opacity: 0.4,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Confidential · Do not distribute</span>
        <span>12 / 47</span>
      </div>
    </div>
  );
}

function LiveFace() {
  return (
    <div
      style={{
        height: '100%',
        padding: 'clamp(22px,4%,40px)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 20,
        background:
          'radial-gradient(120% 100% at 70% 10%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 55%), var(--bg)',
        color: 'var(--fg)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
        <div className="kicker">Live · not a screenshot</div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(26px,3.2vw,40px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Every slide is a <span className="accent-text">web page.</span>
        </h3>
        <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 15, maxWidth: 34 * 8, lineHeight: 1.5 }}>
          Responsive. Interactive. Shared as a URL. The handle is the argument.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {['→ builds', 'A ink', 'P present', 'G grid'].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                padding: '5px 10px',
                borderRadius: 999,
                border: '1px solid var(--hair)',
                background: 'var(--surface)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          borderRadius: 'var(--radius)',
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="kicker" style={{ margin: 0 }}>
            live metric
          </span>
          <span className="accent-text" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            +38%
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 6,
            minHeight: 80,
          }}
        >
          {[40, 55, 48, 72, 66, 88, 80, 100].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 0.7}%`,
                borderRadius: 4,
                background:
                  i === 5
                    ? 'var(--accent)'
                    : 'color-mix(in srgb, var(--primary) 28%, var(--surface-2))',
                border: '1px solid var(--hair-2)',
              }}
            />
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--hair-2)', overflow: 'hidden' }}>
          <div
            style={{
              width: '72%',
              height: '100%',
              background: 'var(--accent)',
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
}
