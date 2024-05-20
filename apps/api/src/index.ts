import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { getCorsConfig } from "./cors";
import { runDrizzleMigrations } from "./db";
import env from "./env";
import { Env } from "./runtime";

import addressesRouter from "./routes/addresses";
import categoriesRouter from "./routes/categories";
import eventsRouter from "./routes/events";
import locationsRouter from "./routes/locations";
import usersRouter from "./routes/users";
import webooksRouter from "./routes/webhooks";

await runDrizzleMigrations();

const app = new Hono<Env>()
  .basePath("/api")
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/webhooks", webooksRouter)
  .route("/users", usersRouter)
  .route("/locations", locationsRouter)
  .route("/categories", categoriesRouter)
  .route("/events", eventsRouter)
  .route("/addresses", addressesRouter);

Bun.serve({
  port: env.PORT,
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) });
  },
});

export type AppType = typeof app;
