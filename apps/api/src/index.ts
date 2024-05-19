import type { SocketAddress } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { getCorsConfig } from "./cors";
import { runDrizzleMigrations } from "./db";
import { AuthUser } from "./db/schema";
import env from "./env";

import categoriesRouter from "./routes/categories";
import eventsRouter from "./routes/events";
import locationsRouter from "./routes/locations";
import usersRouter from "./routes/users";
import webooksRouter from "./routes/webhooks";

await runDrizzleMigrations();

export type Env = {
  Variables: {
    auth: AuthUser;
    withAuth?: AuthUser | undefined;
  };
  Bindings: {
    ip: SocketAddress;
  };
};

const app = new Hono<Env>()
  .basePath("/api")
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/webhooks", webooksRouter)
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
