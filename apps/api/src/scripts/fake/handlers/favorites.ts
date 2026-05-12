import { faker } from '@faker-js/faker';
import { count, eq, inArray } from 'drizzle-orm';
import type z from 'zod';
import { DatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
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
			throw new Error('Failed to generate favorites', { cause: r.reason });
		}
	}

	await updateFavoriteCounts(placeIds);
}

type Insert = z.infer<typeof $insert.favorite>;

function processChunk(userIds: string[], placeIds: string[]) {
	const db = container.get(DatabaseService).get();
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

	return db.insert(schema.favorites).values(batch);
}

async function updateFavoriteCounts(placeIds: string[]) {
	const placeIdsChunks = chunkArray(placeIds, 100);

	const results = await Promise.allSettled(
		placeIdsChunks.map((chunk) => updateChunkFavoriteCounts(chunk)),
	);

	for (const r of results) {
		if (r.status === 'rejected') {
			throw new Error('Failed to update favorite counts', { cause: r.reason });
		}
	}
}

function updateChunkFavoriteCounts(placeIds: string[]) {
	const db = container.get(DatabaseService).get();

	return db.transaction(async (tx) => {
		const rows = await tx
			.select({ placeId: schema.favorites.placeId, cnt: count() })
			.from(schema.favorites)
			.where(inArray(schema.favorites.placeId, placeIds))
			.groupBy(schema.favorites.placeId);

		const countMap = new Map(rows.map((r) => [r.placeId, r.cnt]));

		for (const placeId of placeIds) {
			await tx
				.update(schema.places)
				.set({ totalFavorites: countMap.get(placeId) ?? 0 })
				.where(eq(schema.places.id, placeId));
		}
	});
}
