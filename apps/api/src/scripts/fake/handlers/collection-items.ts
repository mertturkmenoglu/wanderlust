import { faker } from '@faker-js/faker';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { DatabaseService } from '@/lib/db';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';

export async function generate() {
	const collectionIds = await readFile(paths.collections);
	const placeIds = await readFile(paths.places);
	const chunks = chunkArray(collectionIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk, placeIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate collections:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.collectionItem>;

async function processChunk(collectionIds: string[], placeIds: string[]) {
	const db = container.get(DatabaseService).get();
	const batch: Insert[] = [];

	for (const collectionId of collectionIds) {
		const sampledPlaceIds = faker.helpers.arrayElements(placeIds, 10);

		for (let i = 0; i < sampledPlaceIds.length; i++) {
			const placeId = sampledPlaceIds[i];

			if (!placeId) continue;

			batch.push({
				collectionId: collectionId,
				placeId: placeId,
				index: i + 1,
			});
		}
	}

	await db.insert(schema.collectionItems).values(batch);
}
