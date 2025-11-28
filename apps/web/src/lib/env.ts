import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().default('http://localhost:5000'),
  VITE_ENABLE_IPX: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  VITE_IMG_PROXY_URL: z.string().default('http://localhost:3002'),
  VITE_SEARCH_CLIENT_API_KEY: z.string().default('wanderlust'),
  VITE_SEARCH_CLIENT_URL: z.string().default('http://localhost:8108'),
  VITE_MAPTILER_KEY: z.string(),
  VITE_FLAGS_SERVICE_URL: z.string().default('http://localhost:5001'),
});

export const env = envSchema.parse(import.meta.env);
