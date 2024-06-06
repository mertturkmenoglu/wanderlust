import { env } from '../start';
import * as schema from './schema';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import { logger } from '../logger';

const client = new Client({
  connectionString: env.DB_URL,
});

await client.connect();

export const db = drizzle(client, { schema });

export async function runDrizzleMigrations() {
  if (Bun.env.NODE_ENV === 'development') {
    logger.info('Running Drizzle migrations');
  }

  const migrationClient = new Client({
    connectionString: env.DB_URL,
  });

  await migrationClient.connect();

  const migrationConnection = drizzle(migrationClient);
  await migrate(migrationConnection, { migrationsFolder: 'drizzle' });

  if (Bun.env.NODE_ENV === 'development') {
    logger.info('Drizzle migrations completed');
  }
}

export * from './schema';
