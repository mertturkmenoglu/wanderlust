import { MiddlewareHandler } from "hono";
import { rateLimiter as honoRateLimiter } from "hono-rate-limiter";
import { createMiddleware } from "hono/factory";
import { Env } from "../runtime";

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
      standardHeaders: "draft-6",
      keyGenerator: (c) => c.get("clerkAuth")?.userId ?? c.env.ip.address,
    })
  );
};
