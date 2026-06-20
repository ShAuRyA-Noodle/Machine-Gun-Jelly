import { createGoogleGenerativeAI, type GoogleGenerativeAIProvider } from "@ai-sdk/google";
import { env } from "@/lib/env";

let _google: GoogleGenerativeAIProvider | null = null;

function provider(): GoogleGenerativeAIProvider {
  return (_google ??= createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY }));
}

/**
 * Lazy Google Generative AI provider. Importing this module does not read env
 * or construct a client; the API key is resolved on first model use, at
 * request time, so `next build` and CI do not need live secrets.
 */
export const google: GoogleGenerativeAIProvider = new Proxy(
  function () {} as unknown as GoogleGenerativeAIProvider,
  {
    get(_t, prop) {
      return Reflect.get(provider(), prop, provider());
    },
    apply(_t, _thisArg, args: Parameters<GoogleGenerativeAIProvider>) {
      return provider()(...args);
    },
  },
) as GoogleGenerativeAIProvider;

// Synthesizer + multimodal vision model. Locked by user to gemini-3-flash-preview.
// Created lazily so importing this module does not instantiate the provider.
export const synthesizer = (): ReturnType<GoogleGenerativeAIProvider> => google(env.GEMINI_MODEL);
