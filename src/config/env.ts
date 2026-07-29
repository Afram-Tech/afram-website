import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
  PUBLIC_SITE_URL: z.url().default("http://localhost:4321"),
});

const parsed = envSchema.safeParse({
  MODE: import.meta.env.MODE,
  PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
