# Bolt Slides demo — build log & state

**Goal:** An A+ demo app showcasing every feature/benefit of https://github.com/stackblitz/bolt-slides —
a self-demonstrating 31-slide "interactive tour" deck, built in the engine itself.
User feedback v1: "C grade — too text-heavy. Online demos looked cooler with interactive video."
→ v2 direction: cinematic auto-playing moments + live interactive prototypes inside slides.

## Where things stand (update this section as you go)

- [x] bolt-slides engine copied into repo root (engine in `src/deck/` — LOCKED, never edit)
- [x] `npm install` done; `npx tsc --noEmit` clean; dev server runs (`npm run dev`, port 5173,
      `.claude/launch.json` name "deck")
- [x] Theme: electric indigo in `src/styles/tokens.css` (:root only) — Space Grotesk heads,
      accent gradient #7fd8ff→#b47bff; fonts import line in base.css (+ Fraunces for Paper preset)
- [x] `index.html`: title "Bolt Slides — the interactive tour", ⚡ favicon
- [x] v1 deck: 30 slides in `src/App.tsx`, all 29 library components used
- [x] Custom components v1: `ThemeLab.tsx` (live :root re-theme, 4 presets — VERIFIED working:
      Paper preset re-skins whole deck incl. chrome), `RepoStars.tsx` (live GitHub API fetch)
- [x] `public/flare.svg` hand-drawn aurora (used by Section image demo)
- [x] **v2 cinematic upgrade — components written & typechecked:**
  - [x] `ElectricField.tsx` — canvas storm hero (cursor-reactive motes + lightning, token colors)
  - [x] `PromptMovie.tsx` — auto-looping: prompt types → statuses → 6-mini-deck springs in →
        "✓ Deck ready — 33 slides" (slide 2)
  - [x] `LiveApp.tsx` — clickable dashboard, period/region re-key CountUps + charts (slide 16)
  - [x] `ResponsivePlayground.tsx` — breathes 300↔max px until grabbed; drag handle; cols 3→2→1,
        nav→☰ (slide 13)
  - [x] Rewired `App.tsx`: **33 slides** (order = comment numbers in file; header comment lists
        all self-reference claims). tsc clean.
  - [x] Full walkthrough of all 33 slides — programmatic audit via in-page JS (all slides render,
        builds consume correctly: 3 on Thesis, 4 on Chat; zero console errors; grid=33 thumbs;
        rail, annotator (.ann-canvas/.ann-bar), presenter view (?presenter — timer, editable
        notes, next preview) all verified)
  - [x] Clip audits: desktop 1280×720 + mobile 375×812 → fixed Bento height, keymap labels,
        chart card heights, Tabs overflow-x wrapper, ThemeLab margins. Final: 0px overflow on
        every previously-flagged slide. (Caveat: measure AFTER ~2s settle — mid-transition
        rects give false positives.)
  - [x] Real-browser visual pass via Claude-in-Chrome (in-app pane renderer wedged — screenshots
        time out; JS channel still works. In Chrome everything confirmed WITH screenshots:
        lightning hero, PromptMovie loop, playground breathing 975→859px + drag→326px (☰ + 1-col),
        LiveApp click 30d→90d redraws, ThemeLab Paper re-themes whole app incl. 3D globe +
        reset to Bolt, grid view of all 33, RepoStars fetched real ★ 379)
  - [x] `npx tsc --noEmit` clean · `npm run build` passes (356 kB JS / 114 kB gzip)
  - [x] README.md rewritten as the demo's front door

## Status: DONE (v2 verified A+ pass). Remaining ideas if user wants more:
  - KeycapDemo (auto-pressing key row) on slide 10; Signal/Reactor screenshots; deploy somewhere
  - LANDED: PR #1 squash-merged to main 2026-07-18 (commit db12aff)

## v3 — "Part five: The next level" (2026-08-17)

User brought an advanced guide ("So you've mastered Bolt Slides…"); recorded it
in **LESSONS.md** and demonstrated it live as a new chapter, slides 37–46,
inserted between ThemeLab (36) and Pricing (now 47). **Deck is now 49 slides.**

- [x] `LESSONS.md` — the 10 guide sections, adapted to this repo's hard rules
      (guide's Recharts/Nivo/Visx/R3F recs recorded but demoed dependency-free)
- [x] `tokens.css` — added the guide's "design system comment block" + a
      SEMANTIC LAYER (`--accent-soft`, `--accent-strong`, `--surface-elevated`,
      `--text-muted`, `--line-accent`) derived via `color-mix()`. Token *names*
      only added, never changed; engine untouched.
- [x] New components (tokens-only, responsive, reduced-motion safe, no deps):
  - `HueDial.tsx` — slide 39: one hue slider rewrites `--primary`/`--accent`
    (oklch) at runtime; swatch strip shows the color-mix recipes following
  - `MotionLab.tsx` — slide 40: layout/layoutId morph + staggerChildren +
    AnimatePresence exit, one segmented-control toy
  - `ParamExplorer.tsx` — slide 41: two sliders → live token-themed SVG
    compounding curve + tabular figure
  - `ExplodedStack.tsx` — slide 42: CSS-3D exploded diagram of the repo's five
    layers, hover-linked legend, explode slider
  - `ShipChecklist.tsx` — slide 46: interactive 6-item checklist, "Ship it."
    verdict at 6/6
- [x] Prose slides: 37 Section n=5 · 38 mindset (2 builds) · 43 patterns Bento ·
      44 two-pass playbook (Split+CodeWindow) · 45 architecture (4 builds)
- [x] All interactive controls stopPropagation on keys so sliders/buttons don't
      page the deck (same convention as ThemeLab/CommandStage)

## v3.1 — Part five filled out as a gallery (2026-08-17, same session)

Goal: "fill out the demo with tons of inspiring examples of the advanced
ideas in action." Six more demos inserted into Part five (now slides 37–52);
**deck is now 55 slides.**

- [x] `SpringLab.tsx` — slide 41: stiffness/damping sliders + replay runway;
      prints the exact `transition` prop to copy home
- [x] `MorphingChart.tsx` — slide 43: registers 2 click-steps via
      `registerMax` so → re-sorts then re-scales the SAME bars (real shelf
      counts) — "builds that animate the data"
- [x] `TokenTreemap.tsx` — slide 44 (Split): dep-free treemap of all 29
      components, columns = shelf share, per-shelf tints via color-mix off
      the one accent; hover/click isolates a shelf
- [x] `StoryboardSorter.tsx` — slide 46: framer-motion `Reorder` list of 6
      story beats; SVG story-arc line + rising-ending detector redraw live
- [x] `PriorityMatrix.tsx` — slide 47: drag chips across an impact × effort
      2×2 (drag + layoutId re-parenting); quadrant tallies re-count
- [x] `ContrastAudit.tsx` — slide 48: computes WCAG ratios of the CURRENT
      tokens (canvas-resolved, works for oklch/color-mix); MutationObserver
      on :root re-audits after ThemeLab/HueDial re-themes
- [x] Claims re-synced (below); LESSONS.md & README updated

### v3.1 self-reference claims (supersedes v3 table)

| Claim | Where | Value |
|-------|-------|-------|
| Total slides | PromptMovie badge, Chat msg, Agenda title, presenter mock ("13 / 55"), README | **55** |
| Agenda stops | Agenda | **six** |
| "You're on slide 7" | Chat | unchanged ✓ |
| Deep-link tiles | Bento "#14" (14) and patterns Bento "#49" (49) | ✓ |
| "Ten slides from now → re-theme" | Accordion 26 → ThemeLab 36 | unchanged ✓ |
| "The next fourteen slides" | mindset slide 38 → demos 39–52 | ✓ |
| Explorer citations | patterns Bento 49 → "Slide 42" + "41 tuned a spring" | ✓ |
| 3D citation | architecture 51 → "slide 45" | ✓ |
| Patterns Bento cites | slides 6 · 19 · 20 · 35 · 42 · 47 | ✓ |
| Part five span | header comment + LESSONS.md | 37–52 |

## v2 slide order (31) — self-reference claims that MUST stay true

| # | Slide | Claim to keep in sync |
|---|-------|----------------------|
| 1 | Custom hero (ElectricField canvas) | — |
| 2 | PromptMovie auto-demo | "31 slides" in its Deck-ready badge |
| 3 | Thesis (3 builds) | — |
| 4 | Contrast files vs apps | — |
| 5 | Agenda | "Five stops, thirty-one slides" |
| 6 | Chat (meta exchange) | says "You're on slide 6" + "authored 31 slides" |
| 7 | BigNumber "1 prompt" | — |
| 8 | Section n=1 The engine | — |
| 9 | Keymap Table | highlightRow=5 is the P row |
| 10 | Presenter Split+BrowserFrame mock | mock shows "Slide 10 / 31", Next = slide 11 title |
| 11 | Bento engine (+RepoStars live fetch) | deep-link tile says "#11" |
| 12 | ResponsivePlayground | — |
| 13 | Section n=2 The library | — |
| 14 | Charts trio | bar data = real census: Struct 5, Data 8, Story 6, Product 4, Flair 6 = 29 |
| 15 | LiveApp clickable dashboard | — |
| 16 | StatGrid | 29 components / 3 deps / 9 theme families (all real) |
| 17 | Timeline 9:00→10:00 | — |
| 18 | Comparison | — |
| 19 | Tabs (5 shelves, chip lists) | — |
| 20 | Accordion FAQ | "Eight slides from now you'll re-theme" → ThemeLab at 28 ✓ |
| 21 | CodeWindow Split | — |
| 22 | Section n=3 The flair, image=/flare.svg | — |
| 23 | Globe (drag, arcs, real coords) | — |
| 24 | SpotlightCard principles | — |
| 25 | Team = agents (auto-initials) | — |
| 26 | Marquee roll call | "All 29" = the 29 library components, all truly used |
| 27 | Section n=4 Make it yours | — |
| 28 | ThemeLab (4 presets) | — |
| 29 | Pricing $0×3 | — |
| 30 | Quote "Taste comes standard." | — |
| 31 | Cover used as CTA "Prompt one." | keeps "every component appears" claim true |

## Hard rules (from .bolt/skills/slides/SKILL.md)

- NEVER edit `src/deck/**` or base.css (except its font @import line) or token *names*
- Text-only slides must be centered; side-visual slides may be asymmetric
- New components: tokens only (no raw hex except swatch data), responsive, reduced-motion safe,
  zero new dependencies
- Facts must stay real: 29 components, 3 deps (react/react-dom/framer-motion), 9 theme families,
  MIT, StackBlitz. Never invent stats.

## Environment notes

- Windows; repo C:\Claude\bolt-demo; remote aigorahub/bolt-demo (do NOT commit/push unasked)
- Reference clone of upstream at scratchpad/bolt-slides (same session scratchpad)
- Dev server may already be running via Browser pane preview (serverId changes per session)
