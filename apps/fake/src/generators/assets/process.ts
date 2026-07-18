import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { Fake } from '@/lib/fake';

type Insert = Types.Assets.$Insert.Asset;

export async function processChunk(placeIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		const imageCount = faker.number.int({ min: 4, max: 10 });

		for (let i = 0; i < imageCount; i++) {
			batch.push({
				entityType: 'place',
				entityId: placeId,
				url: Fake.Random.imageUrl(),
				description: `Photo of place ${placeId} - ${i + 1}`,
				order: i,
			});
		}
	}

	await db.insert(schema.assets).values(batch).onConflictDoNothing();
}
