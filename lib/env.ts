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

let cached: Env | null = null;

/**
 * Validate lazily, on first access, instead of at module load.
 * This keeps `next build` (and CI / fresh clones) from failing when the
 * environment is not yet populated, while still throwing the moment any
 * value is actually read at request time.
 */
function load(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables - see .env.example");
  }
  cached = parsed.data;
  return cached;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return load()[prop as keyof Env];
  },
}) as Env;
