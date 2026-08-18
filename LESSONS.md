# Bolt Slides, level 2 — lessons recorded

Source: an advanced guide ("So you've mastered Bolt Slides…"), recorded here and
**demonstrated live in this deck's Part five** (slides 37–46, "The next level").
Where the guide's advice conflicts with this repo's hard rules (notably its
zero-new-dependencies policy from `.bolt/skills/slides/SKILL.md`), the lesson is
recorded as written and the demo uses the repo's dependency-free equivalent.

## 1. Mindset: experiences, not slides

Stop thinking in slides. Every slide is a React component that can fetch live
data, contain working UI, respond to the audience, hold internal state, and
embed a real prototype. A great deck is a lightweight web app that happens to
advance one "page" at a time.

**Demoed:** slide 38 states it; the whole deck proves it (`LiveApp`, `LivePulse`,
`RepoStars`, `CommandStage`).

## 2. Theming & design discipline (level 2)

- Build a **semantic token layer** on top of the primitives (`--accent-soft`,
  `--surface-elevated`, `--accent-strong`) — derived with `color-mix()`, never
  hand-picked, so the whole deck stays coherent when `--primary` changes.
- Define intentional theme variants and switch them from one place (this repo's
  `ThemeLab` presets are exactly that: Bolt / Reactor / Signal / Paper).
- Lock the typography hierarchy: only the existing scale
  (`.display .headline .lead .subhead .kicker .foot .figure`) — never invent
  font sizes.
- **Pro move (adopted):** keep a short design-system comment block at the top of
  `tokens.css` describing the theme every time a deck is themed.

**Demoed:** slide 39 (`HueDial`) — drag one hue and watch surfaces, glows, and
charts all derive from the single primitive. Semantic layer lives in
`src/styles/tokens.css`.

## 3. Motion & progressive disclosure

- Prefer `layout` / `layoutId` for shared-element transitions between builds.
- Stagger children (`staggerChildren`) for related lists/grids instead of one
  `<Build>` per item.
- `<Build>` + `AnimatePresence` for exit animations — rare but powerful.
- Respect `prefers-reduced-motion`, always (the engine sets
  `MotionConfig reducedMotion="user"`; custom rAF/CSS animation must check it
  themselves).
- Reuse the engine's `<Reveal delay direction>`-style wrapper rather than
  reinventing entrances (this repo already ships `src/deck/Reveal.tsx`).

**Demoed:** slide 40 (`MotionLab`) — the same four cards morph between three
layouts via `layoutId`, enter with a stagger, and a caption exits through
`AnimatePresence`.

## 4. Data visualization

Guide's recommendation ladder (for decks that allow dependencies):

| Goal | Library |
|------|---------|
| Default / most decks | Recharts |
| Beautiful defaults, more types | Nivo |
| Fully custom viz | Visx |
| Raw power, sparingly | D3 |

This repo stays dependency-free by rule, so charts are hand-rolled SVG
(`src/components/Charts.tsx`). The transferable rules hold either way:

- **Theme charts from the tokens** — never library default palettes.
- Prefer charts the audience can hover/click during the talk.
- Animate data changes when builds reveal new information.

**Demoed:** slide 41 (`ParamExplorer`) — a live parameter explorer where sliders
redraw a token-themed chart in real time; slide 18 shows the token-themed
chart trio.

## 5. 3D and spatial content

Guide recommends React Three Fiber + Drei for orbitable product models,
exploded diagrams, data globes, network graphs. Restraint rule: **one strong 3D
moment per deck** beats three mediocre ones.

Dependency-free equivalents used here: the canvas `Globe` (slide 29) and the
CSS-3D `ExplodedStack` (slide 42) — an exploded diagram of this repo's own
architecture, with a hover-linked legend.

## 6. Interactivity patterns that actually matter

Before/after sliders · parameter explorers · clickable maps/region selectors ·
tabs/segmented controls · live counters · embedded working prototypes.
Rule: the interaction must clarify a concept or let the audience test a claim.

**Demoed:** slide 43 is a Bento mapping each pattern to where it already lives
in this deck (morph handle #6, room pulse #20, explorer #41, palette #35 …).

## 7. Agent workflow upgrades

1. **Scope first** — force four answers before generation: topic + aesthetic,
   approximate length, text density, motion level.
2. **Two-pass generation** — pass 1: structure + content + basic theming;
   pass 2: "interactivity and visual polish only."
3. **Component extraction** — once something works, move it to
   `src/components/` and tell the agent to reuse it.
4. **Constraint reinforcement** — repeat: "Do not touch `src/deck/`. Only edit
   `App.tsx`, `tokens.css`, and new components."
5. **Visual QA loop** — walk the deck, give slide-and-build-specific feedback.

**Demoed:** slide 44 shows the whole loop as a prompt playbook in a CodeWindow.

## 8. Architecture for bigger decks

- Keep slide-level state local; lift only when slides must share it.
- Extract repeated patterns into shared components early.
- Clean loading/error states for live data (React Query/SWR in dep-allowing
  repos; here, `RepoStars` does it by hand).
- Cross-slide state via a small store (Zustand) only if truly needed.
- **Performance:** heavy 3D/charts should mount only while their slide is
  active — this engine already renders only `slides[slide]` live, so that
  comes free.

**Demoed:** slide 45 (build-by-build rules).

## 9. Presentation-day superpowers

Deep links (`/#12`) for Q&A jumps · presenter notes with talking points and
timing cues · annotation tools (`A`) for live markup · share the URL so the
audience follows and interacts on their own devices.

All already native to the engine; slide 43's Bento calls them out.

## 10. The "next level" checklist

Before calling a deck finished:

- [ ] At least one slide lets the audience *do* something
- [ ] Charts are themed from tokens, not default colors
- [ ] Motion is purposeful, not decorative
- [ ] Some slide could work as a standalone interactive prototype
- [ ] The best custom components are extracted for reuse
- [ ] The deck feels calm and intentional at presentation speed

**Demoed:** slide 46 (`ShipChecklist`) — the checklist itself, interactive.

---

The core: **restraint + one or two memorable interactive moments + ruthless
consistency in the design system.**
