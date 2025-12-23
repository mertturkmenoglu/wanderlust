import { DbProvider } from '@/db';
import { ioc } from '@/ioc';

export async function generate() {
	const sqlText = await Bun.file('src/scripts/fake/handlers/cities.sql').text();
	const db = ioc.resolve(DbProvider.id);

	await db.execute(sqlText);
}
