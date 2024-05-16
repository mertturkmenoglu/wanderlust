import type { Config } from "drizzle-kit";
import env from "../env";
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB_URL,
  },
} satisfies Config;
