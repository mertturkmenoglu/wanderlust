import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';

export async function generate() {
	const listIds = await readFile(paths.lists);
	const placeIds = await readFile(paths.places);

	const chunks = chunkArray(listIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk, placeIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate list items:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.listItem>;

async function processChunk(listIds: string[], placeIds: string[]) {
	const db = ioc.resolve(DbProvider.id);
	const batch: Insert[] = [];

	for (const listId of listIds) {
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

	await db.insert(schema.listItems).values(batch);
}
