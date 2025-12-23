import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';

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

function processChunk(userIds: string[], placeIds: string[]) {
	const db = ioc.resolve(DbProvider.id);
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
