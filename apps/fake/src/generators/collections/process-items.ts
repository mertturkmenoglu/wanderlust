import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';

type Insert = Types.Collections.$Insert.Item;

export async function processItems(
	collectionIds: string[],
	placeIds: string[],
) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const id of collectionIds) {
		const sample = faker.helpers.arrayElements(placeIds, 10).map((p, i) => ({
			collectionId: id,
			placeId: p,
			index: i,
		}));

		batch.push(...sample);
	}

	await db.insert(schema.collectionItems).values(batch).onConflictDoNothing();
}
