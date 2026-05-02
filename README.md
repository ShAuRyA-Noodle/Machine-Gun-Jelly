# Machine Gun Jelly

> The browser is the wrong abstraction for the AI era. We replace it with an agent swarm that hands you the answer — and keeps working while you sleep.

**Codename:** Machine Gun Jelly · **Public name (TBD):** Latent

## The one-line pitch

What if every `Cmd+T` was an agent swarm instead of a search bar?

## The thesis

The web was built around the unit of "a page." Search engines became "find the right page." Browsers became "render the right page." But people don't want pages — they want **answers** and **actions**.

The current AI-search wave (Perplexity, Arc Search, Dia, You.com) ships text answers. We ship something fundamentally different:

1. **Generative UI per query** — every answer is a custom-rendered interactive widget (table, map, timeline, comparison, booking flow), assembled live by a UI-classifier agent.
2. **Parallel agent fan-out** — 4–6 specialist agents work the query in parallel and stream results into the UI as they finish.
3. **Action, not info** — agents don't just tell you the best flight; they book it.
4. **Persistent agents** — queries don't end. "Watch for a price drop" becomes a long-running agent in your dashboard.

## Why this is top 0.0001%

| Competitor   | What they ship      | What they miss                          |
|--------------|---------------------|------------------------------------------|
| Google       | Page list           | No synthesis, no action                  |
| Perplexity   | Cited text answer   | Static, no UI, no action                 |
| Arc Search   | "Browse for me"     | Single agent, stateless, info-only       |
| Dia          | Sidekick chat       | Wrapper, no parallel agents, no UI gen   |
| ChatGPT      | Conversation        | No persistence, no tools by default      |
| **Latent**   | **Agent swarm + generative UI + actions + persistent agents** | — |

The moat is **generative UI per query**. Nobody is shipping it because it requires (a) a fast UI classifier, (b) streaming React component generation, (c) reliable schema-constrained tool use, (d) browser-action agents. All four are now technically feasible with Claude tool use + Stagehand/Browserbase + streaming JSX.

## Architecture (high-level)

```
User query
   │
   ▼
[Router]  ─────► classifies → picks UI template + agent set
   │
   ├──► [ScoutAgent]      ── headless browser scrapes
   ├──► [CriticAgent]     ── reads reviews / Reddit / YT transcripts
   ├──► [PriceAgent]      ── price history / drop prediction
   ├──► [DealAgent]       ── coupons, bank offers
   ├──► [LogisticsAgent]  ── delivery / route / time
   └──► [ActionAgent]     ── books, buys, replies (on user approval)
        │
        ▼
[Synthesizer] ──► merges → streams to UI ──► [Generative UI Renderer]
        │
        ▼
[Memory] ──► learns user preferences across sessions
        │
        ▼
[Background Garden] ──► long-running agents (price watch, restock, etc.)
```

## The demo

1. Judge types: *"flight to Bangalore tomorrow morning under 8k that lets me make an 11am meeting"*
2. UI scaffolds in 200ms: timeline of the day + flight cards + meeting overlay.
3. Six agents fan out (visible as live cards): Skyscanner, Maps airport→office, Calendar buffer check, deals, logistics, synthesis.
4. Cards fill in live. Final card: *"IndiGo 6E-203 — 6:15am, lands 7:50am, you reach office 9:20am with 1h40m buffer. ₹6,240."*
5. Judge clicks **Book it**. ActionAgent autofills, asks for OTP, books.
6. Mic drop.

## Tech stack

- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind + shadcn/ui — deployed on Vercel
- **Runtime:** Node 24 / Edge
- **AI:** Anthropic Claude (Sonnet 4.6 for agents, Haiku 4.5 for router/classifier, Opus 4.7 for synthesis on complex queries)
- **Browser automation:** Stagehand (Browserbase) for ActionAgent
- **Streaming:** Server-Sent Events for live agent updates + Vercel AI SDK for UI streaming
- **Generative UI:** Streamed JSX components rendered via `react-jsx-runtime`
- **Memory:** SQLite (libsql/Turso) + embeddings via Voyage or OpenAI
- **Voice (stretch):** Whisper + TTS for hands-free queries

## MVP scope (24–48h grind)

- [ ] Phase 0 — scaffold Next.js, deploy hello-world to Vercel
- [ ] Phase 1 — single-agent query → text answer (baseline like Perplexity)
- [ ] Phase 2 — router classifies query → picks 1 of 4 UI templates (table / map / timeline / compare)
- [ ] Phase 3 — multi-agent fan-out with live streaming agent cards
- [ ] Phase 4 — one full action flow (book / buy / reply) via Stagehand
- [ ] Phase 5 — background-agent garden (persistent watchers)
- [ ] Phase 6 — voice input, polish, demo script, fallback cache for offline judging

## Status

Day 0 — scaffolding.
