import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';

type Insert = Types.Favorites.$Insert.Favorite;

export async function processChunk(userIds: string[], placeIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const userId of userIds) {
		const tmp = faker.helpers
			.arrayElements(placeIds, {
				min: 10,
				max: 20,
			})
			.map((placeId) => ({
				userId,
				placeId,
			}));

		batch.push(...tmp);
	}

	return db.insert(schema.favorites).values(batch).onConflictDoNothing();
}
