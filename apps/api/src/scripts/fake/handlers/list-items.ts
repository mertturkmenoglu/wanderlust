import { faker } from '@faker-js/faker';
import pLimit from 'p-limit';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import type { TDatabaseService } from '@/lib/db';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';
import { getDb } from './common';

export async function generate() {
	const db = await getDb();
	const listIds = await readFile(paths.lists);
	const placeIds = await readFile(paths.places);
	const limit = pLimit(4);

	const chunks = chunkArray(listIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => limit(() => processChunk(db, chunk, placeIds))),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate list items:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.listItem>;

async function processChunk(
	db: TDatabaseService,
	listIds: string[],
	placeIds: string[],
) {
	const batch: Insert[] = [];

	for (const listId of listIds) {
		if (Math.random() < 0.1) continue; // Randomly skip some lists to create more variability

		const n = faker.number.int({ min: 4, max: 10 });
		const sampledPlaceIds = faker.helpers.arrayElements(placeIds, n);

		for (let i = 0; i < sampledPlaceIds.length; i++) {
			const placeId = sampledPlaceIds[i];

			if (!placeId) continue;

			batch.push({
				listId: listId,
				placeId: placeId,
				index: i + 1,
			});
		}
	}

	if (batch.length === 0) return;

	await db.insert(schema.listItems).values(batch);
}
