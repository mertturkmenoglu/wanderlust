import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { getCorsConfig } from "./cors";
import { runDrizzleMigrations } from "./db";
import { AuthUser } from "./db/schema";
import env from "./env";
import usersRouter from "./routes/users";
import webooksRouter from "./routes/webhooks";

await runDrizzleMigrations();

export type Env = {
  Variables: {
    auth: AuthUser;
    withAuth?: AuthUser | undefined;
  };
};

const app = new Hono<Env>()
  .basePath("/api")
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/webhooks", webooksRouter)
  .route("/users", usersRouter);

export default {
  port: env.PORT,
  fetch: app.fetch,
};

export type AppType = typeof app;
