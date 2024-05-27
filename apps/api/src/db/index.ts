import { env } from '../start';
import * as schema from './schema';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { logger } from '../logger';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DB_URL);
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export async function runDrizzleMigrations() {
  if (Bun.env.NODE_ENV === 'development') {
    logger.info('Running Drizzle migrations');
  }

  const migrationPostgres = postgres(env.DB_URL, { onnotice: () => {} });
  const migrationConnection = drizzle(migrationPostgres);
  await migrate(migrationConnection, { migrationsFolder: 'drizzle' });

  if (Bun.env.NODE_ENV === 'development') {
    logger.info('Drizzle migrations completed');
  }
}

export * from './schema';
