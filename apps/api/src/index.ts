import { runDrizzleMigrations } from "@/db";
import {
  categoriesRouter,
  eventsRouter,
  locationsRouter,
  usersRouter,
  webhooksRouter,
} from "@/routes";
import { env, type Env } from "@/start";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { getCorsConfig } from "./cors";
import { initSearch } from "./search";

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
