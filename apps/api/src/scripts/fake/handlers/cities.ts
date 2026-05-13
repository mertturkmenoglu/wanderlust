import { container } from '@/ioc';
import { DatabaseService } from '@/lib/db';

export async function generate() {
	const sqlText = await Bun.file('src/scripts/fake/handlers/cities.sql').text();
	const db = container.get(DatabaseService).get();

	await db.execute(sqlText);
}
