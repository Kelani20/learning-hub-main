import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("true")
  .transform((value) => value === "true");

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value && value.trim().length > 0 ? value : undefined));

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_DEMO_MODE: booleanFromString,
  DEMO_USER_ID: z.string().default("demo_learner"),
  DEMO_ADMIN_ID: z.string().default("demo_instructor"),
  AUTH_PROVIDER: z.enum(["demo", "clerk"]).default("demo"),
  VIDEO_PROVIDER: z.enum(["url", "mux"]).default("url"),
  PAYMENT_PROVIDER: z.enum(["demo", "stripe"]).default("demo"),
  QUIZ_PROVIDER: z.enum(["local", "openai"]).default("local"),
  DISCUSSION_PROVIDER: z.enum(["database"]).default("database"),
  CLERK_SECRET_KEY: optionalString,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalString,
  STRIPE_API_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,
  MUX_TOKEN_ID: optionalString,
  MUX_TOKEN_SECRET: optionalString,
  OPENAI_API_KEY: optionalString,
  NEXT_PUBLIC_STREAM_KEY: z.string().default("demo_stream_key"),
  STREAM_SECRET: z.string().default("demo_stream_secret"),
});

export const env = envSchema.parse(process.env);

export const isDemoMode = env.NEXT_PUBLIC_DEMO_MODE;
