# Machine Gun Jelly

> The browser is the wrong abstraction for the AI era. We replace it with an agent swarm that hands you the answer and keeps working while you sleep.

**Codename:** Machine Gun Jelly. **Public name (provisional):** Latent.

## The one-line pitch

What if every `Cmd+T` was an agent swarm instead of a search bar?

## The thesis

The web was built around the unit of "a page." Search engines became "find the right page." Browsers became "render the right page." But people do not want pages. They want **answers** and **actions**.

The current AI-search wave (Perplexity, Arc Search, Dia, You.com) ships text answers. We aim for something different:

1. **Generative UI per query.** Every answer is a custom-rendered interactive widget (table, map, timeline, comparison, booking flow), assembled live by a UI-classifier agent.
2. **Parallel agent fan-out.** Four to six specialist agents work the query in parallel and stream results into the UI as they finish.
3. **Action, not just info.** Agents do not only tell you the best flight. They book it.
4. **Persistent agents.** Queries do not end. "Watch for a price drop" becomes a long-running agent in your dashboard.

## Why this is different

| Competitor   | What they ship      | What they miss                          |
|--------------|---------------------|------------------------------------------|
| Google       | Page list           | No synthesis, no action                  |
| Perplexity   | Cited text answer   | Static, no UI, no action                 |
| Arc Search   | "Browse for me"     | Single agent, stateless, info only       |
| Dia          | Sidekick chat       | Wrapper, no parallel agents, no UI gen   |
| ChatGPT      | Conversation        | No persistence, no tools by default      |
| **Latent**   | **Agent swarm plus generative UI plus actions plus persistent agents** | the goal |

The moat is **generative UI per query**. It requires (a) a fast UI classifier, (b) streaming React component generation, (c) reliable schema-constrained tool use, and (d) browser-action agents. All four are now technically feasible with modern tool use, headless browser automation, and streaming JSX.

## Architecture (target)

```
User query
   |
   v
[Router]  -> classifies, picks UI template plus agent set
   |
   |-> [ScoutAgent]      headless browser scrapes
   |-> [CriticAgent]     reads reviews / Reddit / YT transcripts
   |-> [PriceAgent]      price history / drop prediction
   |-> [DealAgent]       coupons, bank offers
   |-> [LogisticsAgent]  delivery / route / time
   |-> [ActionAgent]     books, buys, replies (on user approval)
        |
        v
[Synthesizer] -> merges, streams to UI -> [Generative UI Renderer]
        |
        v
[Memory] -> learns user preferences across sessions
        |
        v
[Background Garden] -> long-running agents (price watch, restock, and more)
```

## The demo

1. Judge types: *"flight to Bangalore tomorrow morning under 8k that lets me make an 11am meeting"*
2. UI scaffolds in 200ms: timeline of the day, flight cards, meeting overlay.
3. Six agents fan out (visible as live cards): Skyscanner, Maps airport to office, calendar buffer check, deals, logistics, synthesis.
4. Cards fill in live. Final card: *"IndiGo 6E-203, 6:15am, lands 7:50am, you reach office 9:20am with 1h40m buffer. Rs 6,240."*
5. Judge clicks **Book it**. ActionAgent autofills, asks for OTP, books.
6. Mic drop.

## Tech stack

- **Frontend:** Next.js 16 (App Router) plus React 19 plus Tailwind v4 plus Framer Motion 12 plus cmdk plus Phosphor icons, deployed on Vercel.
- **Design system:** see [`DESIGN.md`](./DESIGN.md). All UI work is bound by the rules there (no `Inter`, no `#000000`, no AI purple, no centered hero, and so on).
- **Runtime:** Node 24 with Edge routes where Playwright is not needed.
- **LLMs (free-tier first):**
  - Router / classifier: **Groq Llama 3.1 8B Instant** (sub-100ms).
  - Specialist agents: **Groq Llama 3.3 70B Versatile** (fast tool use).
  - Synthesizer: **`gemini-3-flash-preview`** (Gemini).
  - Hard reasoning: **Groq DeepSeek R1 Distill 70B**.
  - Code / canvas-template gen: **Groq Qwen 2.5 Coder 32B**.
  - Vision: **`gemini-3-flash-preview`** (multimodal native).
  - Premium fallback (demo only): **OpenRouter** to a frontier model.
- **Voice:** Groq Whisper Large v3 (speech to text) plus a local TTS web worker.
- **Browser automation:** local Playwright with LLM-driven action prompts. Browserbase optional.
- **Streaming:** server-sent events per agent plus Vercel AI SDK typed UI streaming.
- **Generative UI:** streamed JSX (allow-listed component subset), rendered via a custom JSX runtime sandbox.
- **Memory:** Turso (libSQL) plus Gemini text embeddings for agent memory and watchers.
- **Background:** Inngest for cron and queues.
- **Mail / notifications:** Resend plus Web Push fallback.
- **Search:** Tavily (primary) plus Brave (backup) plus Reddit API for the critic agent.

## What ships today

Phase 0 is in place: a Next.js 16 app shell, the Tailwind v4 design tokens from `DESIGN.md`, the command bar, and a single streaming endpoint at `/api/echo` that restates your goal and lists the agents it would dispatch. The full swarm is not wired yet. See the roadmap below.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the keys you have
npm run dev                  # http://localhost:3000
```

Only `GROQ_API_KEY` and `GEMINI_API_KEY` are needed for the `/api/echo` route today. The build does not require secrets; env is validated lazily, at request time. See [`.env.example`](./.env.example) for the full list.

Scripts:

```bash
npm run dev        # local dev server
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Roadmap

- [x] Phase 0: scaffold Next.js, design tokens, command bar, streaming echo route.
- [ ] Phase 1: single-agent query to text answer (baseline like Perplexity).
- [ ] Phase 2: router classifies query, picks one of four UI templates (table, map, timeline, compare).
- [ ] Phase 3: multi-agent fan-out with live streaming agent cards.
- [ ] Phase 4: one full action flow (book, buy, reply) via headless browser automation.
- [ ] Phase 5: background-agent garden (persistent watchers).
- [ ] Phase 6: voice input, polish, demo script, fallback cache for offline judging.

## Security

See [`SECURITY.md`](./SECURITY.md). CodeQL (`security-extended`) runs on push, pull request, and weekly. Dependabot watches dependencies. Secrets never live in the repo; copy `.env.example` to `.env.local` and keep keys local.

## Status

Day 0. Scaffolding.
