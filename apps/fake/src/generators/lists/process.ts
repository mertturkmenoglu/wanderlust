import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema, type TDatabaseService } from '@wanderlust/db';

type Insert = Types.Lists.$Insert.List;

export async function processListChunk(
	db: TDatabaseService,
	userIds: string[],
) {
	const batch: Insert[] = [];

	for (const userId of userIds) {
		if (Math.random() < 0.1) continue; // Randomly skip some users to create more variability

		const count = faker.number.int({ min: 1, max: 5 });

		for (let i = 0; i < count; i++) {
			batch.push({
				id: faker.string.nanoid(),
				userId: userId,
				name: faker.lorem.sentence({ min: 2, max: 5 }).replace('.', ''),
				isPublic: faker.datatype.boolean(),
			});
		}
	}

	if (batch.length === 0) return;

	await db.insert(schema.lists).values(batch).onConflictDoNothing();
}
