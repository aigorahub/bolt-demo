import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Build from './deck/Build';
import Reveal from './deck/Reveal';
import Accordion from './components/Accordion';
import Agenda from './components/Agenda';
import Bento from './components/Bento';
import BigNumber from './components/BigNumber';
import BrowserFrame from './components/BrowserFrame';
import { BarChart, LineChart, DonutChart } from './components/Charts';
import Chat from './components/Chat';
import CodeWindow from './components/CodeWindow';
import Comparison from './components/Comparison';
import Contrast from './components/Contrast';
import CountUp from './components/CountUp';
import Cover from './components/Cover';
import ElectricField from './components/ElectricField';
import Globe from './components/Globe';
import LiveApp from './components/LiveApp';
import PromptMovie from './components/PromptMovie';
import ResponsivePlayground from './components/ResponsivePlayground';
import Marquee from './components/Marquee';
import Pricing from './components/Pricing';
import Quote from './components/Quote';
import RepoStars from './components/RepoStars';
import Section from './components/Section';
import Split from './components/Split';
import SpotlightCard from './components/SpotlightCard';
import StatGrid from './components/StatGrid';
import Steps from './components/Steps';
import Table from './components/Table';
import Tabs from './components/Tabs';
import Team from './components/Team';
import ThemeLab from './components/ThemeLab';
import TiltCard from './components/TiltCard';
import Timeline from './components/Timeline';
import VisualDashboard from './components/VisualDashboard';

/* ══════════════════════════════════════════════════════════════════════
   BOLT SLIDES — THE INTERACTIVE TOUR
   A deck about the deck engine, built in the deck engine. 33 slides;
   every component in src/components appears live, every engine feature
   (builds, notes, presenter, annotations, grid, deep links, theming) is
   both used and explained, and four custom components (ElectricField,
   PromptMovie, LiveApp, ResponsivePlayground, plus ThemeLab/RepoStars)
   prove the system is extensible. Facts are the repo's own: 29 library
   components, 3 dependencies, 9 theme families, MIT.
   Self-referential numbers that must stay true if slides move:
   Chat says "slide 6"; Bento tile says "#12"; presenter mock says
   "Slide 11 / 33"; Accordion says "eight slides from now" (→ ThemeLab);
   PromptMovie badge and Chat say "33 slides".
   ══════════════════════════════════════════════════════════════════════ */

const panel = (extra = 0.22): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  background: `radial-gradient(120% 100% at 30% 20%, color-mix(in srgb, var(--primary) ${
    extra * 100
  }%, transparent), transparent 60%), var(--surface-2)`,
});

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 'var(--radius)',
  background: 'var(--surface)',
  border: '1px solid var(--hair)',
};

const ChipRow = ({ items }: { items: string[] }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      maxWidth: 660,
      marginInline: 'auto',
    }}
  >
    {items.map((c) => (
      <span
        key={c}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          padding: '6px 12px',
          borderRadius: 999,
          border: '1px solid var(--hair)',
          background: 'var(--surface)',
          whiteSpace: 'nowrap',
        }}
      >
        {c}
      </span>
    ))}
  </div>
);

const centerHead: React.CSSProperties = {
  textAlign: 'center',
  marginInline: 'auto',
  marginBottom: 'clamp(22px,4vh,38px)',
};

export default function App() {
  return (
    <Deck>
      {/* 1 · Hero — custom slide, animated canvas storm behind the title */}
      <Slide
        full
        nav="Cover"
        notes="Hold here a beat — the lightning is a live canvas, not a video; move the cursor and the motes shy away. Tell them: nothing tonight is a screenshot. Then arrow through."
      >
        <div style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <ElectricField />
        </div>
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--gutter-y) var(--gutter)',
          }}
        >
          <Reveal>
            <div className="kicker" style={{ marginBottom: 16 }}>
              StackBlitz · Open source
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display">
              Every slide is a <span className="accent-text">web page.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="subhead" style={{ marginTop: 20, marginInline: 'auto' }}>
              This is Bolt Slides — a deck engine where presentations are
              working web apps. Including this one.
            </p>
          </Reveal>
          <Reveal delay={0.34}>
            <p className="foot" style={{ marginTop: 26 }}>
              MIT · github.com/stackblitz/bolt-slides · press → to begin
            </p>
          </Reveal>
        </div>
      </Slide>

      {/* 2 · PromptMovie — the launch-video moment, except it's live DOM */}
      <Slide
        nav="One prompt"
        notes="Say nothing for the first loop. The prompt types itself, the agent reports progress, a mini deck springs together — then it loops. It's DOM, not video: the thumbnails are drawn by the same tokens as everything else."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            How decks happen here
          </div>
          <h2
            className="headline"
            style={{ ...centerHead, marginBottom: 'clamp(18px,3vh,28px)' }}
          >
            Type a sentence. <span className="accent-text">Get an app.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ maxWidth: 880, marginInline: 'auto', width: '100%' }}>
            <PromptMovie />
          </div>
        </Reveal>
      </Slide>

      {/* 3 · Thesis — click-builds, first taste */}
      <Slide
        center
        nav="Thesis"
        notes="Each → you press is a click-build. Press ← and they rewind in reverse order — show that off before moving on."
      >
        <h2
          className="headline"
          style={{ fontSize: 'clamp(34px,5.5vw,64px)', marginInline: 'auto' }}
        >
          AI slides are easy.{' '}
          <span className="accent-text">Good ones aren’t.</span>
        </h2>
        <Build at={1}>
          <p className="lead" style={{ marginTop: 22, marginInline: 'auto' }}>
            Prompted decks tend to come out as slop — generic layouts, walls of
            bullets.
          </p>
        </Build>
        <Build at={2}>
          <p className="lead" style={{ marginTop: 10, marginInline: 'auto' }}>
            Yet the same agents ship working software every day.
          </p>
        </Build>
        <Build at={3}>
          <p className="subhead" style={{ marginTop: 22, marginInline: 'auto' }}>
            So Bolt Slides hands your agent a real deck engine — and every
            slide becomes a live, responsive web page.
          </p>
        </Build>
      </Slide>

      {/* 4 · Agenda */}
      <Agenda
        nav="Agenda"
        notes="Orient the room in thirty seconds. The hints on the right are the payoff of each stop."
        kicker="The tour"
        title="Five stops, thirty-three slides."
        items={[
          { title: 'Why slides should be apps', hint: 'now' },
          { title: 'The engine', hint: 'builds · notes · ink' },
          { title: 'The library', hint: '29 components' },
          { title: 'The flair', hint: '3D · motion' },
          { title: 'Make it yours', hint: 'live re-theme' },
        ]}
      />

      {/* 5 · Contrast — files vs apps */}
      <Contrast
        nav="Files vs. apps"
        notes="Let the left panel sting. Everyone in the room has shipped final_v7.pptx at some point."
        kicker="The difference"
        title="Slide files vs. slide apps."
        left={{
          label: 'Slideware',
          title: 'A fixed canvas',
          points: [
            '1080 × 607, scale-to-fit, clipped edges',
            'Interactivity dies in the PDF export',
            'Charts are screenshots of charts',
          ],
        }}
        right={{
          label: 'Bolt Slides',
          title: 'A running app',
          points: [
            'Responsive layouts that reflow to any screen',
            'Live data, 3D, and working prototypes inside slides',
            'Shared as a URL — your audience opens a link',
          ],
        }}
      />

      {/* 6 · Chat — the real workflow, one message per click */}
      <Chat
        nav="The exchange"
        notes="Advance one message at a time — the Chat component turns every message into a build. Pause after ‘You’re on slide 5.’"
        kicker="The workflow"
        title="One prompt. This deck."
        name="bolt.new"
        messages={[
          {
            from: 'user',
            text: 'Build me a demo deck that shows off everything Bolt Slides can do.',
          },
          {
            from: 'ai',
            text: 'Done — themed the tokens electric indigo, authored 33 slides, wired the click-builds, and left you speaker notes.',
          },
          { from: 'user', text: 'Prove it.' },
          {
            from: 'ai',
            text: 'You’re on slide 6 of it. Press P — the notes are waiting.',
          },
        ]}
      />

      {/* 7 · BigNumber — the one drama beat */}
      <BigNumber
        nav="One"
        notes="Let the figure breathe. One prompt is the whole pitch: the skill file teaches any agent to theme, compose, and write the deck."
        kicker="From prompt to podium"
        value="1"
        caption="prompt is what this deck cost. The bundled skill did the theming, the layout, and the copy."
        foot=".bolt/skills/slides/SKILL.md — read by Bolt, Claude Code, Cursor, Codex"
      />

      {/* 8 · Section — Part one */}
      <Section
        nav="Part one"
        notes="Breathe. New chapter — the presenting machinery."
        n={1}
        kicker="Part one"
        title={
          <>
            The <span className="accent-text">engine.</span>
          </>
        }
      />

      {/* 9 · Steps — how it works */}
      <Steps
        nav="How it works"
        notes="Walk left to right. The point: the chrome — dock, rail, presenter — exists before your first slide does."
        kicker="How it works"
        title="Prompt to presentable in three moves."
        items={[
          {
            title: 'Prompt',
            body: 'Open the repo in Bolt — or point any coding agent at it — and describe the deck you need.',
          },
          {
            title: 'Author',
            body: 'The skill themes the tokens, then writes each slide as a plain, responsive React component.',
          },
          {
            title: 'Present',
            body: 'Dock, thumbnail rail, presenter view, annotations — the chrome is already built.',
          },
        ]}
      />

      {/* 10 · Table — the real keymap */}
      <Slide
        nav="Keymap"
        notes="This slide is honest — press the keys while it’s up. G is the crowd-pleaser."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            Muscle memory
          </div>
          <h2 className="headline" style={centerHead}>
            The whole deck, on your keyboard.
          </h2>
        </Reveal>
        <Reveal>
          <Table
            columns={['Key', { label: 'What happens', align: 'left' }]}
            rows={[
              ['→ · Space', 'Next — builds first'],
              ['←', 'Previous — rewinds'],
              ['G', 'Grid of every slide'],
              ['S', 'Thumbnail rail'],
              ['A', 'Annotate the slide'],
              ['P', 'Presenter, synced'],
              ['H', 'Hide the chrome'],
            ]}
            highlightRow={5}
            caption="Also: F fullscreen · Home / End jump · Esc closes — try them now."
          />
        </Reveal>
      </Slide>

      {/* 11 · Split + BrowserFrame — presenter mode */}
      <Split
        flip
        nav="Presenter"
        notes="If you’re reading this in the presenter view right now: hi, it worked. These notes are editable — click into them — and your edits persist."
        kicker="Press P"
        title={
          <>
            A presenter view that <span className="accent-text">keeps up.</span>
          </>
        }
        body="A second tab, synced over BroadcastChannel: timer, current and next slide, and your notes — editable mid-talk, saved locally."
        media={
          <>
            <div style={panel(0.18)} />
            <div
              style={{
                position: 'relative',
                padding: 'clamp(14px,3vw,36px)',
                width: '100%',
              }}
            >
              <BrowserFrame url="localhost:5173/?presenter#11">
                <div
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: 'var(--accent)',
                        color: 'var(--accent-ink)',
                      }}
                    >
                      07:42
                    </span>
                    <span className="foot">Slide 11 / 33</span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(min(170px, 100%), 1fr))',
                      gap: 12,
                    }}
                  >
                    <div style={{ ...card, padding: 16 }}>
                      <div className="foot" style={{ marginBottom: 6 }}>
                        Now
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>
                        A presenter view that keeps up.
                      </div>
                    </div>
                    <div
                      className="hide-narrow"
                      style={{ ...card, padding: 16, opacity: 0.55 }}
                    >
                      <div className="foot" style={{ marginBottom: 6 }}>
                        Next
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>
                        The chrome you don’t have to build.
                      </div>
                    </div>
                  </div>
                  <div style={{ ...card, padding: 16 }}>
                    <div className="foot" style={{ marginBottom: 6 }}>
                      Notes — click to edit
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: 'var(--fg-muted)',
                        lineHeight: 1.5,
                      }}
                    >
                      If you’re reading this aloud, it’s working.
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </>
        }
      />

      {/* 12 · Bento — engine features (with a live API fetch) */}
      <Bento
        nav="Under the hood"
        notes="The star count in the accent tile was fetched from the GitHub API when this slide loaded — slides are apps, so a slide can call an API."
        kicker="Under the hood"
        title="The chrome you don’t have to build."
        tiles={[
          {
            k: 'Builds',
            title: 'Click-steps, both directions',
            body: '→ reveals the next beat; ← rewinds it.',
            c: 5,
            r: 2,
            variant: 'glow',
          },
          {
            k: 'Annotations · A',
            title: 'Content-anchored ink',
            body: 'A circle drawn on a laptop finds its stat on a phone.',
            c: 4,
          },
          {
            k: 'Deep links',
            fig: <span style={{ fontFamily: 'var(--font-mono)' }}>#12</span>,
            body: 'The URL hash tracks this slide.',
            c: 3,
          },
          {
            k: 'Live data',
            fig: <RepoStars />,
            body: 'Fetched from the GitHub API just now.',
            c: 4,
            variant: 'accent',
          },
          {
            k: 'Synced tabs',
            title: 'BroadcastChannel',
            body: 'Presenter and audience in lockstep.',
            c: 3,
          },
        ]}
      />

      {/* 13 · ResponsivePlayground — the no-fixed-canvas pitch, as a toy */}
      <Slide
        nav="No fixed canvas"
        notes="It breathes on its own — narrow, wide, narrow — until you grab the handle on the right edge. Grab it. Columns re-stack, the nav collapses to a burger, the readout tracks the px. Slideware clips; this reflows."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            Responsive, not scaled
          </div>
          <h2
            className="headline"
            style={{ ...centerHead, marginBottom: 'clamp(24px,4vh,40px)' }}
          >
            There is no 1080 × 607 here.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ResponsivePlayground />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="foot" style={{ marginTop: 22, textAlign: 'center' }}>
            Grab the handle. Every real slide in this deck reflows the same way.
          </p>
        </Reveal>
      </Slide>

      {/* 14 · Section — Part two */}
      <Section
        nav="Part two"
        notes="Chapter turn. The next eight slides are built from the library they describe."
        n={2}
        kicker="Part two"
        title={
          <>
            The <span className="accent-text">library.</span>
          </>
        }
      />

      {/* 15 · Charts — bar, line, donut */}
      <Slide
        nav="Charts"
        notes="All three chart types draw themselves in when the slide appears — SVG and CSS, no chart dependency. The bar data is the real component census."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            Charts, hand-rolled
          </div>
          <h2 className="headline" style={centerHead}>
            No chart library. Obviously.
          </h2>
        </Reveal>
        <Reveal>
          <div className="cols">
            <div style={card}>
              <div className="kicker" style={{ marginBottom: 12 }}>
                Bar — the library, counted
              </div>
              <div style={{ height: 132 }}>
                <BarChart
                  data={[
                    { label: 'Struct', value: 5 },
                    { label: 'Data', value: 8 },
                    { label: 'Story', value: 6 },
                    { label: 'Product', value: 4 },
                    { label: 'Flair', value: 6 },
                  ]}
                  height={132}
                  showValues
                />
              </div>
              <p className="foot" style={{ marginTop: 10, marginBottom: 0 }}>
                Components per shelf — 29 total.
              </p>
            </div>
            <div style={card}>
              <div className="kicker" style={{ marginBottom: 12 }}>
                Line — invented points, real draw-in
              </div>
              <LineChart points={[12, 16, 14, 22, 26, 34, 30, 44]} height={132} />
            </div>
            <div
              style={{
                ...card,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <DonutChart value={100} label="web pages" size={132} />
            </div>
          </div>
        </Reveal>
      </Slide>

      {/* 16 · LiveApp — a working product inside a slide */}
      <Slide
        nav="It runs"
        notes="Click the period and region controls — the numbers re-count and the charts replay their draw-in. A working prototype is a legal slide here; embed the real product when you have one."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            Working prototype
          </div>
          <h2
            className="headline"
            style={{ ...centerHead, marginBottom: 'clamp(18px,3vh,28px)' }}
          >
            This slide is an app. <span className="accent-text">Click it.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ maxWidth: 860, marginInline: 'auto', width: '100%' }}>
            <LiveApp />
          </div>
        </Reveal>
      </Slide>

      {/* 17 · Split + TiltCard + VisualDashboard */}
      <Split
        nav="Live visuals"
        notes="Hover the card — it tilts toward the cursor with a moving glare. The dashboard inside draws in: CountUp figures, sparkline, bars."
        kicker="Composed visuals"
        title={
          <>
            Data that <span className="accent-text">performs.</span>
          </>
        }
        body="A dashboard mock that draws itself in and tilts on hover — CountUp figures, sparkline, bars. Every pixel reads the same theme tokens."
        media={
          <>
            <div style={panel(0.22)} />
            <div
              style={{
                position: 'relative',
                padding: 'clamp(14px,3vw,40px)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TiltCard>
                <VisualDashboard />
              </TiltCard>
            </div>
          </>
        }
      />

      {/* 18 · StatGrid — the real inventory */}
      <StatGrid
        nav="Inventory"
        notes="Three real numbers: 29 components in src/components, exactly three runtime dependencies, nine documented theme families. The figures count up on entry."
        kicker="The inventory"
        title="Small engine, wide range."
        stats={[
          {
            value: <CountUp to={29} />,
            label: 'components',
            caption: 'one import each',
          },
          {
            value: <CountUp to={3} />,
            label: 'dependencies',
            caption: 'react, react-dom, framer-motion',
          },
          {
            value: <CountUp to={9} />,
            label: 'theme families',
            caption: 'you’ll try four of them soon',
          },
        ]}
      />

      {/* 19 · Timeline */}
      <Slide
        nav="Timeline"
        notes="The connector draws in, then milestones land one by one. This is the realistic schedule, not the aspirational one."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            A realistic schedule
          </div>
          <h2 className="headline" style={{ ...centerHead, marginBottom: 'clamp(20px,3vh,32px)' }}>
            Prompt at 9. Present at 10.
          </h2>
        </Reveal>
        <div style={{ maxWidth: 580, marginInline: 'auto' }}>
          <Timeline
            items={[
              {
                time: '9:00',
                title: 'Prompt',
                body: '“Build me a deck pitching the Q3 plan to the exec team.”',
              },
              {
                time: '9:12',
                title: 'Skim & steer',
                body: 'Rename a section, paste the real numbers, cut a slide.',
              },
              {
                time: '9:40',
                title: 'Rehearse',
                body: 'P for presenter — tighten your notes in place.',
              },
              {
                time: '10:00',
                title: 'Present',
                body: 'F for fullscreen. Send the URL as the leave-behind.',
              },
            ]}
          />
        </div>
      </Slide>

      {/* 20 · Comparison */}
      <Slide
        nav="Comparison"
        notes="The accent column is one prop — highlight={0}. The pptx filename usually gets the laugh; wait for it."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            The honest matrix
          </div>
          <h2 className="headline" style={centerHead}>
            Receipts, in one grid.
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ maxWidth: 840, marginInline: 'auto' }}>
            <Comparison
              cols={['', 'Bolt Slides', 'Slideware']}
              highlight={0}
              rows={[
                { label: 'Slides reflow to any screen', values: [true, false] },
                { label: 'Slides can run code', values: [true, false] },
                { label: 'Version control', values: ['git', 'final_v7 (2).pptx'] },
                { label: 'The handout', values: ['the URL', '38 MB attachment'] },
                { label: 'License', values: ['MIT', 'per seat'] },
              ]}
            />
          </div>
        </Reveal>
      </Slide>

      {/* 21 · Tabs — the library, shelved */}
      <Slide
        nav="The shelves"
        notes="Click through the shelves — or use ← → inside the tab bar; the deck won’t page while the bar has focus. The pill slides, panels cross-fade."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            One kit, five shelves
          </div>
          <h2 className="headline" style={{ ...centerHead, marginBottom: 'clamp(20px,3vh,30px)' }}>
            The library, shelved.
          </h2>
        </Reveal>
        <Reveal style={{ maxWidth: 780, marginInline: 'auto', width: '100%' }}>
          {/* the bar itself may pan on very narrow screens; panels wrap */}
          <div style={{ maxWidth: '100%', overflowX: 'auto', paddingBottom: 2 }}>
          <Tabs
            tabs={[
              {
                label: 'Structure',
                content: (
                  <div>
                    <ChipRow
                      items={['Cover', 'Agenda', 'Section', 'Split', 'Bento']}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--fg-muted)',
                        fontSize: 14,
                        marginTop: 16,
                        marginBottom: 0,
                      }}
                    >
                      The skeletons — how a slide holds its shape.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Data',
                content: (
                  <div>
                    <ChipRow
                      items={[
                        'BarChart',
                        'LineChart',
                        'DonutChart',
                        'Table',
                        'StatGrid',
                        'BigNumber',
                        'CountUp',
                        'VisualDashboard',
                      ]}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--fg-muted)',
                        fontSize: 14,
                        marginTop: 16,
                        marginBottom: 0,
                      }}
                    >
                      Proof, animated — draw-in charts and counting numerals.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Story',
                content: (
                  <div>
                    <ChipRow
                      items={[
                        'Quote',
                        'Contrast',
                        'Comparison',
                        'Timeline',
                        'Steps',
                        'Chat',
                      ]}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--fg-muted)',
                        fontSize: 14,
                        marginTop: 16,
                        marginBottom: 0,
                      }}
                    >
                      The persuasion moves — before/after, roadmaps, receipts.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Product',
                content: (
                  <div>
                    <ChipRow
                      items={['CodeWindow', 'BrowserFrame', 'Pricing', 'Team']}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--fg-muted)',
                        fontSize: 14,
                        marginTop: 16,
                        marginBottom: 0,
                      }}
                    >
                      Show the thing itself — code, screens, plans, people.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Flair',
                content: (
                  <div>
                    <ChipRow
                      items={[
                        'Globe',
                        'TiltCard',
                        'SpotlightCard',
                        'Marquee',
                        'Accordion',
                        'Tabs',
                      ]}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--fg-muted)',
                        fontSize: 14,
                        marginTop: 16,
                        marginBottom: 0,
                      }}
                    >
                      Restrained delight. You’re inside one right now.
                    </p>
                  </div>
                ),
              },
            ]}
          />
          </div>
        </Reveal>
      </Slide>

      {/* 22 · Accordion — FAQ */}
      <Slide
        nav="Fair questions"
        notes="Open only what the room asks about. The last answer sets up the theme lab eight slides from here."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            Asked often
          </div>
          <h2 className="headline" style={{ ...centerHead, marginBottom: 'clamp(20px,3vh,30px)' }}>
            Fair questions.
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ maxWidth: 720, marginInline: 'auto' }}>
            <Accordion
              items={[
                {
                  title: 'Do I have to know React?',
                  body: 'Your agent writes the components; you steer in plain language and edit copy in JSX. If you can read HTML, you can read a slide.',
                },
                {
                  title: 'Will it clip on the projector?',
                  body: 'There is no fixed canvas. Slides are responsive layouts — the same deck reflows to phones, laptops, and that one 4:3 projector.',
                },
                {
                  title: 'Can I add my own components?',
                  body: 'Encouraged. The kit is a floor, not a ceiling — only the engine and the token names are locked. This deck added two.',
                },
                {
                  title: 'What about my brand?',
                  body: 'Every color, font, radius, and shadow is a token in one :root block. Eight slides from now, you’ll re-theme this deck live.',
                },
              ]}
            />
          </div>
        </Reveal>
      </Slide>

      {/* 23 · Split + CodeWindow — authoring */}
      <Split
        flip
        nav="Authoring"
        notes="The highlighted lines are the signature: wrap anything in Build and it lands on the nth click. Notes are just a prop."
        kicker="Authoring"
        title={
          <>
            A slide is a <span className="accent-text">React child.</span>
          </>
        }
        body="Drop a component into <Deck> and it’s a slide. Wrap anything in <Build at={n}> and it lands on the nth click. Speaker notes ride along as a prop."
        media={
          <>
            <div style={panel(0.16)} />
            <div
              style={{
                position: 'relative',
                padding: 'clamp(14px,3vw,36px)',
                width: '100%',
              }}
            >
              <CodeWindow
                title="App.tsx"
                highlight={[6, 7, 8]}
                code={`<Deck>
  <Cover kicker="Acme · Q3" title="Acme" />

  <Slide center nav="Thesis" notes="Hold a beat.">
    <h2 className="headline">Ship the answer.</h2>
    <Build at={1}>
      <p className="lead">Not another dashboard.</p>
    </Build>
  </Slide>
</Deck>`}
              />
            </div>
          </>
        }
      />

      {/* 24 · Section — Part three, with a full-bleed image */}
      <Section
        nav="Part three"
        notes="Section takes an image prop — full-bleed under an automatic theme-correct scrim. This background is a hand-drawn SVG, not a photo."
        n={3}
        kicker="Part three"
        title={
          <>
            The <span className="accent-text">flair.</span>
          </>
        }
        image="/flare.svg"
      />

      {/* 25 · Globe — a deck is a URL */}
      <Globe
        nav="A deck is a URL"
        notes="Drag the globe — it spins. Canvas-drawn, dependency-free, and it reads its colors from the theme tokens like everything else."
        kicker="The reach"
        title={
          <>
            Your deck is a <span className="accent-text">URL.</span>
          </>
        }
        body="No install, no export, no wrong version of Keynote. Send the link; it opens on whatever screen your audience is holding."
        markers={[
          {
            location: [37.77, -122.41],
            size: 0.08,
            label: 'sfo',
            value: 'built here',
          },
          { location: [40.71, -74.0], size: 0.06 },
          {
            location: [51.5, -0.12],
            size: 0.07,
            label: 'lon',
            value: 'opens in a tab',
          },
          { location: [52.52, 13.4], size: 0.05 },
          { location: [6.52, 3.37], size: 0.05 },
          { location: [12.97, 77.59], size: 0.06 },
          {
            location: [1.35, 103.82],
            size: 0.06,
            label: 'sin',
            value: 'same URL',
          },
          { location: [35.68, 139.69], size: 0.06 },
          { location: [-33.87, 151.2], size: 0.05 },
          { location: [-23.55, -46.63], size: 0.06 },
        ]}
        arcs={[
          { from: [37.77, -122.41], to: [51.5, -0.12] },
          { from: [37.77, -122.41], to: [1.35, 103.82] },
          { from: [37.77, -122.41], to: [-23.55, -46.63] },
        ]}
        stats={[
          { value: '1', label: 'URL to share' },
          { value: '0', label: 'installs for your audience' },
          { value: '∞', label: 'screen sizes it fits' },
        ]}
      />

      {/* 26 · SpotlightCards — principles */}
      <Slide
        nav="House rules"
        notes="Move the cursor across the cards — the glow follows it. Three rules the skill actually enforces."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>
            House rules
          </div>
          <h2 className="headline" style={centerHead}>
            Taste, enforced.
          </h2>
        </Reveal>
        <Reveal>
          <div className="cols">
            {[
              {
                k: '01',
                t: 'Taste comes standard',
                d: 'Bespoke layouts, oversized type, one accent — never eight bullets in Arial.',
              },
              {
                k: '02',
                t: 'A floor, not a ceiling',
                d: 'When no component fits, write one. Only the engine and token names are locked.',
              },
              {
                k: '03',
                t: 'One idea per slide',
                d: 'Deliberate negative space. A paged slide never scrolls — it reflows.',
              },
            ].map((p) => (
              <SpotlightCard key={p.k}>
                <div className="kicker accent-text" style={{ marginBottom: 12 }}>
                  {p.k}
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(20px,2.2vw,26px)',
                    fontWeight: 600,
                    margin: '0 0 8px',
                  }}
                >
                  {p.t}
                </h3>
                <p
                  style={{
                    color: 'var(--fg-muted)',
                    fontSize: 15,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {p.d}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </Slide>

      {/* 27 · Team — the agents */}
      <Team
        nav="Your agent"
        notes="No photos on purpose — the Team component draws initial avatars on the accent automatically. Any agent that can read a skill file can author a deck."
        kicker="Bring your agent"
        title="It speaks fluent agent."
        people={[
          { name: 'Bolt', role: 'One prompt, in the browser' },
          { name: 'Claude Code', role: 'Authored the deck you’re in' },
          { name: 'Cursor', role: 'Pair-writes your copy' },
          { name: 'Codex', role: 'Reads the same skill' },
        ]}
      />

      {/* 28 · Marquee — roll call */}
      <Slide
        center
        nav="Roll call"
        notes="Every name in the strip has already been on stage tonight. The marquee is the customer-logo pattern, repurposed honestly."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 14 }}>
            Roll call
          </div>
          <h2
            className="headline"
            style={{ marginInline: 'auto', marginBottom: 'clamp(22px,4vh,36px)' }}
          >
            All 29, on parade.
          </h2>
        </Reveal>
        <Marquee
          duration={46}
          items={[
            'Cover',
            'Agenda',
            'Section',
            'Split',
            'Bento',
            'BarChart',
            'LineChart',
            'DonutChart',
            'Table',
            'StatGrid',
            'BigNumber',
            'CountUp',
            'VisualDashboard',
            'Quote',
            'Contrast',
            'Comparison',
            'Timeline',
            'Steps',
            'Chat',
            'CodeWindow',
            'BrowserFrame',
            'Pricing',
            'Team',
            'Globe',
            'TiltCard',
            'SpotlightCard',
            'Marquee',
            'Accordion',
            'Tabs',
          ]}
        />
        <Reveal>
          <p className="foot" style={{ marginTop: 26 }}>
            Every one of them appears live somewhere in this deck.
          </p>
        </Reveal>
      </Slide>

      {/* 29 · Section — Part four */}
      <Section
        nav="Part four"
        notes="Last chapter: theming, price, and the ask."
        n={4}
        kicker="Part four"
        title={
          <>
            Make it <span className="accent-text">yours.</span>
          </>
        }
      />

      {/* 30 · ThemeLab — live re-theme (custom component) */}
      <Slide
        center
        nav="Theme lab"
        notes="The payoff. Pick Paper for the full whiplash — serif headlines, light surfaces — then hit G and watch every thumbnail wear it. Bolt resets."
      >
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            Live tokens
          </div>
          <h2 className="headline" style={{ marginInline: 'auto' }}>
            Re-theme this deck. <span className="accent-text">Now.</span>
          </h2>
          <p
            className="lead"
            style={{
              marginTop: 12,
              marginBottom: 'clamp(16px,3vh,26px)',
              marginInline: 'auto',
            }}
          >
            Every color, font, radius, and shadow reads from one :root block —
            chrome included. These buttons rewrite it while you watch.
          </p>
        </Reveal>
        <Reveal>
          <ThemeLab />
        </Reveal>
      </Slide>

      {/* 31 · Pricing — the MIT joke, played straight */}
      <Pricing
        nav="Pricing"
        notes="Play it deadpan. The only dishonest thing on this slide is the badge — every tier is the same repo."
        kicker="Pricing"
        title="Three ways to pay nothing."
        tiers={[
          {
            name: 'Clone it',
            price: '$0',
            period: 'forever',
            blurb: 'The classic.',
            features: [
              'git clone, npm run dev',
              'Every component and the engine',
              'MIT — do what you want',
            ],
          },
          {
            name: 'Prompt it',
            price: '$0',
            period: 'forever',
            blurb: 'The fun one.',
            features: [
              'Open the repo in Bolt',
              'Describe the deck; get an app',
              'Share the URL when it lands',
            ],
            highlight: true,
            badge: 'Most popular',
          },
          {
            name: 'Fork it',
            price: '$0',
            period: 'forever',
            blurb: 'The power move.',
            features: [
              'Your tokens, your components',
              'Keep the engine, invent the rest',
              'Ship decks from your own repo',
            ],
          },
        ]}
      />

      {/* 32 · Quote */}
      <Quote
        nav="Quote"
        notes="Read it slowly. It is the project’s whole thesis in three words."
        text="Taste comes standard."
        name="The Bolt Slides README"
        role="github.com/stackblitz/bolt-slides"
      />

      {/* 33 · Close — the Cover component, promoted to CTA */}
      <Cover
        nav="Close"
        notes="Make the ask and stop talking. Leave the URL on screen through questions — and let someone in the room press G to see everywhere you've been."
        kicker="Your move"
        title={
          <>
            Prompt <span className="accent-text">one.</span>
          </>
        }
        subtitle="Open the repo in Bolt — or point your agent at it — and present something alive."
        foot="bolt.new · github.com/stackblitz/bolt-slides · P.S. press G"
      />
    </Deck>
  );
}
