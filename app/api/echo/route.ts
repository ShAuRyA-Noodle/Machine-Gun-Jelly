import { streamText } from "ai";
import { MODELS } from "@/lib/ai/groq";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  query: z.string().min(1).max(2000),
});

const SYSTEM = `You are the warm-up voice of Machine Gun Jelly — a goal-first agent swarm.
You are NOT yet the swarm. The swarm wires up in Phase 1+. For now, when the user asks you
something, restate the goal precisely in one sentence, then list (in monospace bullet form)
the 3-6 specialist agents you would dispatch to satisfy it, and what each would do.
Be terse. No filler. No emojis. Use plain text only.`;

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return new Response("invalid body", { status: 400 });
  }

  const result = streamText({
    model: MODELS.specialist,
    system: SYSTEM,
    prompt: parsed.data.query,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
