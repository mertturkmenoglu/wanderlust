import { env } from ".";
import { cors } from "hono/cors";

type CorsFn = typeof cors;
type Config = Parameters<CorsFn>[0];

export function getCorsConfig(): Config {
  return {
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  };
}
