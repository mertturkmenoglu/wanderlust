import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import type z from 'zod';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';
import { getDb } from './common';

export async function generate() {
	const userIds = await readFile(paths.users);
	const placeIds = await readFile(paths.places);

	const userIdChunks = chunkArray(userIds, 100);

	const results = await Promise.allSettled(
		userIdChunks.map((chunk) => processChunk(chunk, placeIds)),
	);

	for (const r of results) {
		if (r.status === 'rejected') {
			throw new Error('Failed to generate bookmarks', { cause: r.reason });
		}
	}
}

type Insert = z.infer<typeof $insert.bookmark>;

async function processChunk(userIds: string[], placeIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const userId of userIds) {
		const n = faker.number.int({ min: 10, max: 20 });
		const randPlaces = faker.helpers.arrayElements(placeIds, n);

		for (const placeId of randPlaces) {
			batch.push({
				userId: userId,
				placeId: placeId,
			});
		}
	}

	return db.insert(schema.bookmarks).values(batch);
}
