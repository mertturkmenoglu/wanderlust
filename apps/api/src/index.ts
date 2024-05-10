import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { getCorsConfig } from "./cors";
import { runDrizzleMigrations } from "./db";
import mainRouter from "./routes/main";
import webooksRouter from "./routes/webhooks";
import usersRouter from "./routes/users";
import env from "./env";
import { AuthUser } from "./db/schema";

await runDrizzleMigrations();

export type Env = {
  Variables: {
    auth: AuthUser;
  };
};

const app = new Hono<Env>()
  .basePath("/api")
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/", mainRouter)
  .route("/webhooks", webooksRouter)
  .route("/users", usersRouter);

export default {
  port: env.PORT,
  fetch: app.fetch,
};

export type AppType = typeof app;
