import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema, type TDatabaseService } from '@wanderlust/db';

type Insert = Types.Lists.$Insert.Item;

export async function processListItemChunk(
	db: TDatabaseService,
	listIds: string[],
	placeIds: string[],
) {
	const batch: Insert[] = [];

	for (const listId of listIds) {
		if (Math.random() < 0.1) continue; // Randomly skip some lists to create more variability

		const arr = faker.helpers
			.arrayElements(placeIds, {
				min: 4,
				max: 10,
			})
			.map((id, i) => ({
				listId: listId,
				placeId: id,
				index: i + 1,
			}));

		batch.push(...arr);
	}

	if (batch.length === 0) return;

	await db.insert(schema.listItems).values(batch).onConflictDoNothing();
}
