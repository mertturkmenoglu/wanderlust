import { getDb } from './common';

export async function generate() {
	const sqlText = await Bun.file('src/handlers/cities.sql').text();
	const db = await getDb();

	await db.execute(sqlText);
}
