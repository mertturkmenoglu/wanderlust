import { faker } from '@faker-js/faker';
import { eq, sum } from 'drizzle-orm';
import type z from 'zod';
import { DatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { nanoid } from '@/lib/uid';
import { paths } from '..';

export async function generate() {
	const placeIds = await readFile(paths.places);
	const userIds = await readFile(paths.users);

	const chunks = chunkArray(placeIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk, userIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate reviews:', result.reason);
		}
	}

	const updateResults = await Promise.allSettled(
		chunks.map((chunk) => processUpdates(chunk)),
	);

	for (const result of updateResults) {
		if (result.status === 'rejected') {
			console.error('Failed to update places after reviews:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.review>;

async function processChunk(placeIds: string[], userIds: string[]) {
	const db = container.get(DatabaseService).get();

	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		const n = faker.number.int({ min: 1, max: 40 });

		for (let i = 0; i < n; i++) {
			const userId = faker.helpers.arrayElement(userIds);
			const rating = faker.number.int({ min: 1, max: 5 });

			batch.push({
				id: nanoid(),
				placeId,
				userId,
				rating,
				content: faker.lorem.paragraph(),
			});
		}
	}

	await db.insert(schema.reviews).values(batch);
}

async function processUpdates(placeIds: string[]) {
	const db = container.get(DatabaseService).get();

	return db.transaction(async (tx) => {
		for (const placeId of placeIds) {
			const count = await tx.$count(
				schema.reviews,
				eq(schema.reviews.placeId, placeId),
			);

			const [totalRatingResult] = await tx
				.select({
					rating: sum(schema.reviews.rating),
				})
				.from(schema.reviews)
				.where(eq(schema.reviews.placeId, placeId));

			const totalRating = Number(totalRatingResult?.rating ?? '0');

			await tx
				.update(schema.places)
				.set({
					totalVotes: count,
					totalPoints: totalRating,
				})
				.where(eq(schema.places.id, placeId));
		}
	});
}
