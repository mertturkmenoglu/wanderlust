import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_ENABLE_IPX: z.string().transform((v) => v === 'true'),
  VITE_IMG_PROXY_URL: z.string(),
  VITE_SEARCH_CLIENT_API_KEY: z.string(),
  VITE_SEARCH_CLIENT_URL: z.string(),
  VITE_MAPTILER_KEY: z.string(),
  VITE_FLAGS_SERVICE_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);
