import { DatabaseService } from '@/db';
import { container } from '@/ioc';

export async function generate() {
	const sqlText = await Bun.file('src/scripts/fake/handlers/cities.sql').text();
	const db = container.get(DatabaseService).get();

	await db.execute(sqlText);
}
