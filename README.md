# Bolt Slides — the interactive tour

A demo deck that showcases every feature of [bolt-slides](https://github.com/stackblitz/bolt-slides)
by being made of them: **39 slides** about the deck engine, built in the deck engine. Every slide is a
live, responsive web page.

```bash
npm install
npm run dev        # → http://localhost:5173
```

## What to try

| Do this | You'll see |
| --- | --- |
| Land on slide 1 | A live canvas storm: lightning + cursor-shy motes, no video, no deps |
| Slide 2 | An auto-looping movie: a prompt types itself and a mini deck springs together |
| Press `→` on Thesis / Chat | Click-builds; `←` rewinds them |
| Slide 6 | Drag a morph handle: dead PowerPoint vs this live deck |
| Slide 12 | Auto-pressing keycaps for G / S / A / P / F / H (click any key) |
| Slide 15 | Ink that rides a KPI across laptop / tablet / phone layouts |
| Slide 16 | Viewport toy breathes phone↔desktop; grab the handle |
| Slide 19 | Working dashboard: period/region controls redraw charts |
| Slide 20 | Live room pulse: click bars, totals re-count mid-talk |
| Slide 14 | A tile fetching the repo's live GitHub star count |
| Slide 29 | Drag-to-spin 3D globe, zero dependencies |
| Slide 30 | Interactive system constellation: hover nodes, graph leans to cursor |
| Slide 35 | Command palette on a slide (type, arrow, Enter) |
| Slide 36 | Re-theme the running deck: Paper turns everything serif and cream |
| `G` / `S` / `A` / `P` / `F` / `H` | Grid · rail · annotations · presenter · fullscreen · hide chrome |
| Any slide | Speaker notes in presenter mode (`P`); URL hash (`/#16`) deep-links |

## How it's built

- **Engine untouched** — `src/deck/` is stock bolt-slides; the tour lives in
  [`src/App.tsx`](src/App.tsx) plus custom demos the skill encourages:
  `ElectricField`, `PromptMovie`, `MorphReveal`, `KeycapDemo`, `InkAnchors`,
  `LiveApp`, `LivePulse`, `ResponsivePlayground`, `Constellation`, `CommandStage`,
  `ThemeLab`, `RepoStars` — token-driven, responsive, reduced-motion-safe,
  no new dependencies.
- **All 29 library components appear live** (marquee roll call; claims
  29 components / 3 deps / 9 theme families / MIT are real).
- **Theme** is one `:root` block in [`src/styles/tokens.css`](src/styles/tokens.css)
  ("electric bolt": Space Grotesk + a sky→violet accent). Theme Lab rewrites it at runtime.

MIT, same as upstream. Build notes in [PROGRESS.md](PROGRESS.md).
