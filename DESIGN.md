# Design System — Machine Gun Jelly

Single source of truth for all UI in this project. Synthesized from `gpt-taste`, `design-taste-frontend`, and `stitch-design-taste` skills. Award-tier ("Awwwards-grade") is the baseline, not the ceiling.

## 0. Baseline dials

- **DESIGN_VARIANCE:** 8 (asymmetric, intentional whitespace)
- **MOTION_INTENSITY:** 7 (perpetual micro-interactions, scroll choreography on landing only)
- **VISUAL_DENSITY:** 5 (hybrid — landing 3, app shell 5–6, replay/log views 7–8)

## 1. Atmosphere

A focused, charcoal-warm command surface. Linear-tier restraint meets agentic theatricality. Cards breathe. Agents feel alive (perpetual breathing-state). Replay views are dense and forensic. Mobile is first-class.

## 2. Color palette

- **Canvas Ink** `#0B0B0F` — Primary background (off-black, never `#000000`)
- **Surface Slate** `#13131A` — Card / container fill
- **Surface Raised** `#1A1A22` — Elevated panels, modals
- **Whisper Border** `rgba(255, 255, 255, 0.06)` — 1px structural lines
- **Whisper Border Strong** `rgba(255, 255, 255, 0.10)` — Hover/focus borders
- **Charcoal Text** `#EDEDEF` — Primary text
- **Muted Text** `#8B8B92` — Secondary text, metadata
- **Subtle Text** `#5A5A63` — Tertiary, timestamps, agent IDs
- **Accent Ember** `#FF6A3D` — Sole accent. CTAs, focus rings, agent active state. Saturation < 80%.
- **Status Live** `#3DDC97` — Background-agent watcher "active" indicator
- **Status Warn** `#F5C84B` — Warnings, near-rate-limit
- **Status Error** `#E5484D` — Failures

**Rules:**
- Max 1 accent (Ember). No purple/blue AI glow. No neon outer shadows.
- Tinted shadows only — `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]` over dark, `shadow-[0_20px_40px_-15px_rgba(11,11,15,0.08)]` over light.
- Light mode optional, dark mode default (this app is desktop-night-coding aesthetic).

## 3. Typography

- **Display:** `Geist` — 700 weight, `tracking-tighter`, `leading-none`, scale via `clamp(2.5rem, 5vw, 5.5rem)`. H1 max 2 lines. Container `max-w-5xl` minimum.
- **UI / Body:** `Geist` 400/500 — `text-base`, `leading-relaxed`, body lines `max-w-[65ch]`.
- **Mono:** `Geist Mono` — agent IDs, timestamps, JSON snippets, tool calls, all numbers.
- **Banned:** `Inter`, system serif, gradient text on H1, oversized H1 ("scream"), 6-line H1 wrap, 4-line H1 wrap.

## 4. Layout primitives

- Container: `max-w-[1400px] mx-auto`. App shell exception: full-bleed.
- Grids: CSS Grid only. Never `calc()` flex math. `grid-flow-dense` on bento.
- **Anti-center hero:** asymmetric split (text-left, demo-right) on landing. No centered text-on-hero-image.
- **Mobile:** any multi-col layout collapses to single col below `md:` (768px).
- **Full-height:** `min-h-[100dvh]`, never `h-screen`.
- **Section gaps (landing):** `py-32 md:py-48`. App shell uses tighter `py-6` to `py-12`.
- **Horizontal scroll bug guard:** `<main className="overflow-x-hidden w-full max-w-full">` on every page root.

## 5. Component archetypes

### Command bar (primary input)
- Centerpiece. `cmdk` on top of shadcn `<Command>`. Floating glass-pill on first launch, docks to top after first query.
- Spring expand/collapse (`type:"spring", stiffness:120, damping:18`).
- Live placeholder cycles through example queries (Typewriter Effect).
- Hold-space → voice mode (Whisper-on-Groq). Mic icon pulses (perpetual `animate-pulse` only on this).

### Agent card (live)
- `rounded-[1.75rem]` (28px). 1px `Whisper Border`. Tinted diffusion shadow. `bg-Surface-Slate`.
- Header: agent avatar (Phosphor icon, `strokeWidth: 1.5`, color = Ember when active, Muted when idle) + name (Mono) + status dot (breathing pulse when running).
- Body: tool calls as monospace lines, fading in via stagger (`delay = idx * 80ms`).
- Card itself uses `layoutId` so re-ordering by Synthesizer animates fluidly.
- Hover: `border-Whisper-Strong`, `translate-y-[-2px]`, 200ms spring.
- Active push: `scale-[0.98]` on `:active`.

### Generative UI templates (per query)
- **Table:** `divide-y` rows over `bg-Surface-Slate`. Header sticky. Numbers Mono. No card containers per row.
- **Map:** Mapbox style `mapbox://styles/mapbox/dark-v11`, custom Ember pins, route line in Ember at 60% opacity.
- **Timeline:** Vertical thread (1px Whisper Border line, agent dots in Ember). Time labels in Subtle Text Mono. Items are bordered cards.
- **Compare:** 2-column zig-zag (NOT 3-equal-cards). Image left / text right alternating.
- **Inbox:** List with `divide-y`. Email row → expandable with framer `layout` to morph into reply draft inline.
- **Canvas:** Sandbox-rendered JSX, allow-listed components only. White-list: `<Card>`, `<Stat>`, `<List>`, `<Image>`, `<Button>`, typography primitives.

### Buttons
- Primary: `bg-Charcoal-Text text-Canvas-Ink` (high contrast). Push `:active` `-translate-y-[1px]`. No outer glow.
- Accent: `bg-Accent-Ember text-Canvas-Ink`. Used only for irreversible actions (Book / Send / Buy).
- Ghost: `border-Whisper-Border hover:border-Whisper-Strong text-Charcoal`. Default secondary.
- Magnetic micro-physics on Accent buttons only (Framer `useMotionValue`/`useTransform`, never `useState`).

### Inputs
- Label above (`text-xs text-Muted`). Helper below. Error inline below in Status-Error.
- Focus ring: 2px Ember at 50% opacity offset.
- No floating labels.

### States
- **Loading:** Skeletal shimmer matching final layout dimensions. Shimmer = `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)` panning left→right at 1.4s.
- **Empty:** Composed agent intro (avatar pile + 1-line prompt suggestion). Not "No data."
- **Error:** Agents speak failure in their persona ("ScoutAgent: site blocked me, falling back to Tavily").

## 6. Motion engine

- Spring default: `type: "spring", stiffness: 100, damping: 20`.
- Layout transitions: heavy use of Framer `layout` and `layoutId` for agent reorder + inline expansion.
- Stagger: `staggerChildren: 0.06` on lists.
- Perpetual loops: agent status dot (breathing), command-bar mic pulse, watcher "alive" stripe. Each isolated in its own Client Component, `React.memo`'d.
- Hardware accel: only `transform` + `opacity`. Never animate `top/left/width/height`.
- Scroll choreography: landing only (GSAP ScrollTrigger). App shell stays static — no scroll hijack inside the agent canvas.
- View Transitions API for tab/route changes inside app shell.

## 7. Iconography

- `@phosphor-icons/react` — `weight="regular"` default, `weight="bold"` for active state. Standard `size={20}` in app, `size={18}` in dense lists.
- Agent avatars: pick a Phosphor icon per archetype:
  - Scout → `Compass`
  - Critic → `MagnifyingGlassPlus`
  - Price → `ChartLineUp`
  - Deal → `Tag`
  - Logistics → `MapTrifold`
  - Calendar → `CalendarBlank`
  - Action → `Lightning`
  - Synthesizer → `Sparkle`

## 8. Anti-patterns (BANNED)

- Emojis in code, copy, or alt text.
- `Inter`, generic system serif, gradient text on H1.
- Pure black `#000000`.
- Custom mouse cursors.
- Outer/neon shadow glows.
- 3-equal-card feature row.
- Centered hero with stamp icons / pill tags / floating badges over text.
- Cheap meta-labels: "SECTION 01", "QUESTION 04", "ABOUT US".
- "John Doe", "Acme", "Nexus", "SmartFlow", "Lorem ipsum" placeholders.
- `99.99%`, `50%` round-number stats. Use organic data (e.g. `47.2%`, `2,418 agents`).
- AI copy clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize".
- "Scroll to explore", bouncing chevrons, scroll arrows.
- `h-screen` (use `min-h-[100dvh]`).
- `useState` for hover/scroll-driven continuous animations.
- Mixing GSAP and Framer Motion in same component tree.
- Unsplash links (use `picsum.photos/seed/{slug}/W/H`).
- Generic shadcn defaults — every component customized for our radii, palette, motion.

## 9. Performance guardrails

- Grain/noise filters: `fixed inset-0 z-50 pointer-events-none` only. Never on scrolling containers.
- Animate `transform`/`opacity` only.
- Memoize all perpetual-motion components, isolate as leaf Client Components.
- AnimatePresence wraps any list with mount/unmount churn.
- Lazy-load Mapbox, GSAP, ThreeJS — never include in initial bundle.
- Edge runtime for routes that don't need Playwright.
- Aggressive prompt caching on Groq + Gemini (system prompts + tool defs).

## 10. Pre-flight checklist (every PR)

- [ ] H1 ≤ 2 lines, `max-w-5xl` minimum, no stamp icons.
- [ ] Bento grid uses `grid-flow-dense`, zero empty cells.
- [ ] No emojis anywhere.
- [ ] No `Inter`. Geist family enforced.
- [ ] Single accent (Ember). No purple/neon.
- [ ] Mobile collapses to single col below `md:`.
- [ ] `min-h-[100dvh]` not `h-screen`.
- [ ] Loading + Empty + Error states present.
- [ ] Perpetual motion components memoized + isolated.
- [ ] All numbers in Mono.
- [ ] No "John Doe" / "Acme" / "99.99%" placeholders.
- [ ] No "Elevate" / "Seamless" / "Unleash" copy.
- [ ] Phosphor icons w/ consistent `strokeWidth`.
- [ ] Customized shadcn (radii, colors, shadows) — never default.
