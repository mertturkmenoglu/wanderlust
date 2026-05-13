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

	const collectionIds = await readFile(paths.collections);
	const placeIds = await readFile(paths.places);
	const chunks = chunkArray(placeIds, 10);
	const limit = pLimit(4);

	const results = await Promise.allSettled(
		chunks.map((chunk) => limit(() => processChunk(db, chunk, collectionIds))),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate collections-places', {
				cause: result.reason,
			});
		}
	}
}

type Insert = z.infer<typeof $insert.collectionsPlaces>;

async function processChunk(
	db: TDatabaseService,
	placeIds: string[],
	collectionIds: string[],
) {
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		if (Math.random() < 0.5) continue; // Randomly skip some places to create more variability

		const sampledCollectionIds = faker.helpers.arrayElements(collectionIds, 10);

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

	if (batch.length === 0) return;

	try {
		await db.insert(schema.collectionsPlaces).values(batch);
	} catch (_err) {
		// Key collision errors are expected here due to the random nature of the data generation
		// Ignore the error
	}
}
