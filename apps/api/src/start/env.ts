import { bool, cleanEnv, num, str } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  CLERK_SECRET_KEY: str(),
  CLERK_PUBLISHABLE_KEY: str(),
  CLERK_WEBHOOK_SECRET: str(),
  CLIENT_ORIGIN: str({ devDefault: 'http://localhost:3000/' }),
  DB_USER: str({ devDefault: 'postgres' }),
  DB_PASSWORD: str({ devDefault: 'postgres' }),
  DB_HOST: str({ devDefault: 'localhost' }),
  DB_PORT: num({ devDefault: 5432 }),
  DB_NAME: str({ devDefault: 'wanderlust' }),
  DB_URL: str({
    devDefault: 'postgres://postgres:postgres@localhost:5432/wanderlust',
  }),
  MINIO_ENDPOINT: str({ devDefault: 'localhost' }),
  MINIO_PORT: num({ default: 9000 }),
  MINIO_SSL: bool({ devDefault: false }),
  MINIO_ACCESS_KEY: str({ devDefault: 'wanderlust' }),
  MINIO_SECRET_KEY: str({ devDefault: 'wanderlust' }),
  MINIO_DEFAULT_BUCKET: str({ devDefault: 'default' }),
  MINIO_LOCATION: str({ devDefault: 'eu-central-1' }),
  NGROK_URL: str(),
  PORT: num({ devDefault: 5000 }),
  ADMIN_ID: str(),
  TYPESENSE_HOST: str({ devDefault: 'localhost' }),
  TYPESENSE_PORT: num({ devDefault: 8108 }),
  TYPESENSE_PROTOCOL: str({ devDefault: 'http' }),
  TYPESENSE_API_KEY: str(),
});

export default env;

export function onlyDev(e: any) {
  return env.NODE_ENV === 'development' ? e : undefined;
}