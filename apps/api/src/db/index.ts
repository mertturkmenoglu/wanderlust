import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = Bun.env.DB_URL ?? "";

export const sql = postgres(connectionString, {
  onnotice: () => {},
});

export const db = drizzle(sql);

export async function runDrizzleMigrations() {
  const migrationPostgres = postgres(connectionString, { onnotice: () => {} });
  const migrationConnection = drizzle(migrationPostgres);
  await migrate(migrationConnection, { migrationsFolder: "drizzle" });
}
