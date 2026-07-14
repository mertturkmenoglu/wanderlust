import * as schema from '@wanderlust/db/schema';
import { data } from '../fixtures/categories';
import { getDb } from './common';

export async function generate() {
	const db = await getDb();

	await db.insert(schema.categories).values(data);
}
