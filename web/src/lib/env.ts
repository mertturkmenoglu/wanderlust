import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_ENABLE_IPX: z.string().transform((v) => v === 'true'),
  VITE_IMG_PROXY_URL: z.string(),
  VITE_SEARCH_CLIENT_API_KEY: z.string(),
  VITE_SEARCH_CLIENT_URL: z.string(),
  VITE_MAPTILER_KEY: z.string(),
  VITE_REDIRECT_WIP: z.string().transform((v) => v === 'true'),
  VITE_APP_BAR_SHOW_WIP_ICONS: z.string().transform((v) => v === 'true'),
  VITE_ALLOW_OAUTH_LOGINS: z.string().transform((v) => v === 'true'),
});

export const env = envSchema.parse(import.meta.env);
