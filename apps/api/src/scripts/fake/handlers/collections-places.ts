import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
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

type Insert = z.infer<typeof $insert.collectionsPlaces>;

async function processChunk(collectionIds: string[], placeIds: string[]) {
	const db = ioc.resolve(DbProvider.id);
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		const sampledCollectionIds = faker.helpers.arrayElements(collectionIds, 5);

		for (let i = 0; i < sampledCollectionIds.length; i++) {
			const collectionId = sampledCollectionIds[i];

			if (!collectionId) continue;

			batch.push({
				collectionId: collectionId,
				placeId: placeId,
				index: i + 1,
			});
		}
	}

	await db.insert(schema.collectionsPlaces).values(batch);
}
