import { createGroq } from "@ai-sdk/groq";
import { env } from "@/lib/env";

export const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

/**
 * Model registry. Centralized so we swap in one place.
 * All Groq free-tier eligible.
 */
export const MODELS = {
  // Sub-100ms classifier
  router: groq("llama-3.1-8b-instant"),
  // 500+ tok/s tool-using specialist
  specialist: groq("llama-3.3-70b-versatile"),
  // Reasoning when needed
  reasoner: groq("deepseek-r1-distill-llama-70b"),
  // JSX / canvas template generation
  coder: groq("qwen-2.5-coder-32b"),
  // Voice STT
  whisper: groq("whisper-large-v3"),
} as const;
