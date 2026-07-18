import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema, type TDatabaseService } from '@wanderlust/db';

type Insert = Types.Collections.$Insert.PlaceRelation;

export async function processPlaceRelations(
	db: TDatabaseService,
	placeIds: string[],
	collectionIds: string[],
) {
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		if (Math.random() < 0.5) continue; // Randomly skip some places to create more variability

		const sample = faker.helpers
			.arrayElements(collectionIds, 10)
			.map((c, i) => ({
				collectionId: c,
				placeId: placeId,
				index: i,
			}));

		batch.push(...sample);
	}

	if (batch.length === 0) return;

	await db.insert(schema.collectionsPlaces).values(batch).onConflictDoNothing();
}
