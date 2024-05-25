import { Hono } from "hono";
import { hc } from "hono/client";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { runDrizzleMigrations } from "./db";
import {
  categoriesRouter,
  eventsRouter,
  locationsRouter,
  usersRouter,
  webhooksRouter,
} from "./routes";
import { initSearch } from "./search";
import { Env, env, getCorsConfig } from "./start";

await runDrizzleMigrations();
await initSearch();

const app = new Hono<Env>()
  .basePath("/api")
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/webhooks", webhooksRouter)
  .route("/users", usersRouter)
  .route("/locations", locationsRouter)
  .route("/categories", categoriesRouter)
  .route("/events", eventsRouter);

Bun.serve({
  port: env.PORT,
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) });
  },
});

export type AppType = typeof app;

const c = hc<AppType>("");
