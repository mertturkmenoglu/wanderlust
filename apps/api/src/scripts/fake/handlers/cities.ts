import { sql } from 'drizzle-orm';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';

export async function generate() {
	const sqlText = await Bun.file('scripts/fake/handlers/cities.sql').text();
	const db = ioc.resolve(DbProvider.id);

	await db.execute(sql`${sqlText}`);
}
