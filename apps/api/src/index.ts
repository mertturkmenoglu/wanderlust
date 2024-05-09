import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { getCorsConfig } from "./cors";
import { runDrizzleMigrations } from "./db";
import mainRouter from "./routes/main";
import { User } from "@clerk/backend";
import env from "./env";

export type Env = {
  Variables: {
    user: User;
  };
};

const app = new Hono<Env>();

await runDrizzleMigrations();

app
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .route("/", mainRouter);

export default {
  port: env.PORT,
  fetch: app.fetch,
};

export type AppType = typeof app;
