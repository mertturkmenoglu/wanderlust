import { bool, cleanEnv, num, str } from "envalid";

export default cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  CLERK_SECRET_KEY: str(),
  CLERK_PUBLISHABLE_KEY: str(),
  CLERK_WEBHOOK_SECRET: str(),
  CLIENT_ORIGIN: str({ devDefault: "http://localhost:3000/" }),
  DB_URL: str({
    devDefault: "postgres://postgres:postgres@localhost:5432/wanderlust",
  }),
  MINIO_ENDPOINT: str({ devDefault: "localhost" }),
  MINIO_PORT: num({ default: 9000 }),
  MINIO_SSL: bool({ devDefault: false }),
  MINIO_ACCESS_KEY: str({ devDefault: "wanderlust" }),
  MINIO_SECRET_KEY: str({ devDefault: "wanderlust" }),
  MINIO_DEFAULT_BUCKET: str({ devDefault: "default" }),
  MINIO_LOCATION: str({ devDefault: "eu-central-1" }),
  PORT: num({ devDefault: 5000 }),
  ADMIN_ID: str(),
});
