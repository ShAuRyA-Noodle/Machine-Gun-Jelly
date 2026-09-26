import { z } from "zod";

const schema = z.object({
  GROQ_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default("gemini-3-flash-preview"),
  OPENROUTER_API_KEY: z.string().optional(),

  TAVILY_API_KEY: z.string().min(1),
  BRAVE_SEARCH_API_KEY: z.string().optional(),

  TURSO_DATABASE_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),

  RESEND_API_KEY: z.string().min(1),

  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),

  BROWSERBASE_API_KEY: z.string().optional(),
  BROWSERBASE_PROJECT_ID: z.string().optional(),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type Env = z.infer<typeof schema>;

/**
 * Validate each integration when it is used. The echo route only needs Groq;
 * unrelated credentials should not stop it from serving requests.
 */
function load<K extends keyof Env>(key: K): Env[K] {
  const parsed = schema.shape[key].safeParse(process.env[key]);
  if (!parsed.success) {
    throw new Error(`Invalid ${key} environment variable - see .env.example`);
  }
  return parsed.data as Env[K];
}

export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    if (!(prop in schema.shape)) return undefined;
    return load(prop as keyof Env);
  },
}) as Env;
