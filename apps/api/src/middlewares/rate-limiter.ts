import { getAuth } from '@hono/clerk-auth';
import { MiddlewareHandler } from 'hono';
import { rateLimiter as honoRateLimiter } from 'hono-rate-limiter';
import { createMiddleware } from 'hono/factory';
import { type Env } from '../start';

type Options = {
  window?: number;
  limit?: number;
};

export const rateLimiter = (options?: Options): MiddlewareHandler => {
  const { window = 10 * 60 * 1000, limit = 100 } = options ?? {};

  return createMiddleware<Env>(
    honoRateLimiter({
      windowMs: window,
      limit: limit,
      standardHeaders: 'draft-6',
      keyGenerator: (c) => getAuth(c)?.userId ?? c.env.ip.address,
    })
  );
};
