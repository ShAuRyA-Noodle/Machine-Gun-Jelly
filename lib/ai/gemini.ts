import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/lib/env";

export const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

// Synthesizer + multimodal vision model. Locked by user to gemini-3-flash-preview.
export const synthesizer = google(env.GEMINI_MODEL);
