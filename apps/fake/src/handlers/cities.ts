import * as schema from '@wanderlust/db/schema';
import { data } from '../fixtures/cities';
import { getDb } from './common';

export async function generate() {
	const db = await getDb();

	await db.insert(schema.cities).values(data);
}
