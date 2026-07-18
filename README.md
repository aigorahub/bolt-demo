# ⚡ Bolt Slides — the interactive tour

A demo deck that showcases **every feature of [bolt-slides](https://github.com/stackblitz/bolt-slides)
by being made of them** — 33 slides about the deck engine, built in the deck engine. Every slide is a
live, responsive web page.

```bash
npm install
npm run dev        # → http://localhost:5173
```

## What to try

| Do this | You'll see |
| --- | --- |
| Land on slide 1 | A live canvas storm — lightning + cursor-shy motes, no video, no deps |
| Slide 2 | An auto-looping movie: a prompt types itself and a mini deck springs together |
| Press `→` on slides 3 & 6 | Click-builds; `←` rewinds them |
| Slide 13 | The viewport toy breathes phone↔desktop on its own — grab the handle |
| Slide 16 | A working dashboard: click 7d/30d/90d and regions; charts redraw |
| Slide 12 | A tile fetching the repo's live GitHub star count |
| Slide 25 | A drag-to-spin 3D globe, zero dependencies |
| Slide 30 | **Re-theme the running deck** — Paper turns everything serif & cream, globe included |
| `G` / `S` / `A` / `P` / `F` / `H` | Grid view · thumbnail rail · annotations · synced presenter tab · fullscreen · hide chrome |
| Any slide | Speaker notes in presenter mode (`P`); the URL hash (`/#16`) deep-links |

## How it's built

- **Engine untouched** — `src/deck/` is stock bolt-slides; the tour is authored entirely in
  [`src/App.tsx`](src/App.tsx) plus six custom components (the skill encourages extending):
  `ElectricField`, `PromptMovie`, `LiveApp`, `ResponsivePlayground`, `ThemeLab`, `RepoStars` —
  all token-driven, responsive, reduced-motion-safe, and dependency-free.
- **All 29 library components appear live** (slide 28's marquee names them; every claim in the
  deck — 29 components, 3 dependencies, 9 theme families, MIT — is real).
- **Theme** is one `:root` block in [`src/styles/tokens.css`](src/styles/tokens.css)
  ("electric bolt": Space Grotesk + a sky→violet accent). Slide 30 rewrites it at runtime.

MIT, same as upstream. Build state & verification notes live in [PROGRESS.md](PROGRESS.md).
