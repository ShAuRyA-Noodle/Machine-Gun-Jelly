import { createGroq, type GroqProvider } from "@ai-sdk/groq";
import { env } from "@/lib/env";

let _groq: GroqProvider | null = null;

function provider(): GroqProvider {
  return (_groq ??= createGroq({ apiKey: env.GROQ_API_KEY }));
}

/**
 * Lazy Groq provider. Importing this module (e.g. the model registry below)
 * does not read env or construct a client. The API key is resolved on first
 * model use, at request time, so `next build` and CI do not need live secrets.
 */
export const groq: GroqProvider = new Proxy(function () {} as unknown as GroqProvider, {
  get(_t, prop) {
    return Reflect.get(provider(), prop, provider());
  },
  apply(_t, _thisArg, args: Parameters<GroqProvider>) {
    return provider()(...args);
  },
}) as GroqProvider;

type GroqModel = ReturnType<GroqProvider>;

/**
 * Model registry. Centralized so we swap in one place.
 * Model IDs match Groq's current production catalog. Models are created lazily
 * per getter so the registry can be imported without instantiating the provider.
 */
export const MODELS = {
  // Lightweight classifier
  get router(): GroqModel {
    return groq("openai/gpt-oss-20b");
  },
  // Configurable to accommodate Groq account-specific model permissions.
  get specialist(): GroqModel {
    return groq(env.GROQ_MODEL);
  },
  // Reasoning when needed
  get reasoner(): GroqModel {
    return groq("openai/gpt-oss-120b");
  },
  // JSX / canvas template generation
  get coder(): GroqModel {
    return groq("openai/gpt-oss-120b");
  },
  // Voice STT
  get whisper(): GroqModel {
    return groq("whisper-large-v3");
  },
} as const;
