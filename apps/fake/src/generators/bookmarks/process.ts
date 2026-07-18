import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';

type Insert = Types.Bookmarks.$Insert.Bookmark;

export async function processChunk(userIds: string[], placeIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const userId of userIds) {
		const randPlaces = faker.helpers.arrayElements(placeIds, {
			min: 10,
			max: 20,
		});

		for (const placeId of randPlaces) {
			batch.push({
				userId: userId,
				placeId: placeId,
			});
		}
	}

	return db.insert(schema.bookmarks).values(batch).onConflictDoNothing();
}
