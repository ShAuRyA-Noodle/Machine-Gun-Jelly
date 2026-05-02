import { CommandBar } from "@/components/command-bar";
import { LiveIndicator } from "@/components/live-indicator";
import { Sparkle, Compass, ChartLineUp, Tag, MapTrifold } from "@phosphor-icons/react/dist/ssr";

const STATS = [
  { label: "Agents online", value: "47", note: "rolling 24h" },
  { label: "Tasks finished", value: "2,418", note: "while you slept" },
  { label: "Median latency", value: "1.6s", note: "swarm fan-out" },
];

const VERTICALS = [
  {
    icon: Compass,
    title: "Plan my day",
    desc: "Brunch, route, weather, calendar. One sentence becomes an itinerary.",
  },
  {
    icon: ChartLineUp,
    title: "Watch the price",
    desc: "Tell me when the iPhone drops below ₹89k and buy it for me.",
  },
  {
    icon: Tag,
    title: "Find the deal",
    desc: "Best laptop for ML under ₹1.5L. Reddit-vetted, delivery-checked.",
  },
  {
    icon: MapTrifold,
    title: "Reply in my voice",
    desc: "Triage 40 emails in 90 seconds. Drafts that sound like you.",
  },
];

export default function Home() {
  return (
    <main className="relative w-full max-w-full overflow-x-hidden">
      {/* Top utility bar — minimal split nav */}
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-surface-slate edge-refraction">
            <Sparkle size={18} weight="bold" className="text-accent-ember" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-text">
            machine-gun-jelly
          </span>
        </div>
        <LiveIndicator />
      </header>

      {/* HERO — asymmetric, anti-center per DESIGN.md */}
      <section className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 pt-16 md:grid-cols-12 md:gap-16 md:px-10 md:pt-24 lg:pt-32">
        {/* Left: pitch (8 cols) */}
        <div className="md:col-span-8">
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-whisper-border-strong bg-surface-slate px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-text">
            <span className="h-1.5 w-1.5 rounded-full bg-status-live pulse-live" />
            real agents · real actions · no mocks
          </p>

          <h1
            className="font-sans font-semibold leading-[0.95] tracking-tighter text-charcoal-text"
            style={{ fontSize: "clamp(2.6rem, 6.2vw, 5.5rem)" }}
          >
            Type the goal.
            <br />
            <span className="text-muted-text">Watch the swarm finish it.</span>
          </h1>

          <p className="mt-8 max-w-[55ch] text-base leading-relaxed text-muted-text md:text-lg">
            A browser is the wrong abstraction for the AI era. Six specialist agents fan out the
            moment you type. They scrape, compare, decide, and act. The answer assembles in a
            custom interface built for the question — not a list of links.
          </p>

          <div className="mt-12">
            <CommandBar />
          </div>
        </div>

        {/* Right: live stats + verticals (4 cols) */}
        <aside className="md:col-span-4">
          <div className="grid gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-whisper-border bg-surface-slate p-5 shadow-diffusion"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-3xl font-medium tracking-tight text-charcoal-text">
                    {s.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle-text">
                    {s.note}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-text">{s.label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Verticals — 2-col zig-zag, never 3 equal */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="mb-16 flex items-end justify-between gap-8">
          <h2
            className="max-w-3xl font-sans font-medium leading-[1.05] tracking-tight text-charcoal-text"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.75rem)" }}
          >
            One substrate. Every task that used to need ten tabs.
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-subtle-text md:block">
            v0.1 · pre-alpha
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {VERTICALS.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={title}
              className={[
                "group rounded-[1.75rem] border border-whisper-border bg-surface-slate p-8 shadow-diffusion transition-all duration-500",
                "hover:border-whisper-border-strong hover:-translate-y-[2px]",
                i % 2 === 1 ? "md:translate-y-12" : "",
              ].join(" ")}
            >
              <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-surface-raised">
                <Icon size={22} weight="regular" className="text-accent-ember" />
              </span>
              <h3 className="font-sans text-2xl font-medium tracking-tight text-charcoal-text">
                {title}
              </h3>
              <p className="mt-3 max-w-[42ch] text-muted-text leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-t border-whisper-border px-6 py-10 md:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle-text">
          built solo · ship fast · win loud
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle-text">
          47.2% chance you forget every other demo today
        </span>
      </footer>
    </main>
  );
}
