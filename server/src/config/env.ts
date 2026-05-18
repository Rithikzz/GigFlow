import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(5000),
  MONGO_URI: z.string().url().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
});

export type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig;

export function loadEnv(): EnvConfig {
  if (config) return config;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error('Invalid environment variables:\n', errors);
    process.exit(1);
  }

  config = result.data;
  return config;
}

export function getConfig(): EnvConfig {
  if (!config) {
    return loadEnv();
  }
  return config;
}
