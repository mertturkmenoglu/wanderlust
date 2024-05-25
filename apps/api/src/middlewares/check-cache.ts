import { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { CacheKey, cacheRead } from "../cache";
import { Env } from "../start";

export const checkCache = <T>(key: CacheKey): MiddlewareHandler => {
  return createMiddleware<Env>(async (c, next) => {
    const cacheResult = await cacheRead<T>(key);

    if (cacheResult === null) {
      await next();
    } else {
      c.json({
        data: cacheResult,
      });
    }
  });
};
