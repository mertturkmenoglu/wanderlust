import { faker } from '@faker-js/faker';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { nanoid } from '@/lib/uid';
import { getDb } from './common';

type Insert = z.infer<typeof $insert.review>;
type Updates = Record<string, { totalVotes: number; totalPoints: number }>;

export async function processChunk({
	placeIds,
	userIds,
}: {
	placeIds: string[];
	userIds: string[];
}) {
	const db = await getDb();

	const batch: Insert[] = [];
	const updates: Updates = {};

	for (const placeId of placeIds) {
		const n = faker.number.int({ min: 1, max: 25 });
		let totalRating = 0;

		const smallBatch: Insert[] = Array.from({ length: n }, () => {
			const userId = faker.helpers.arrayElement(userIds);
			const rating = faker.number.int({ min: 1, max: 5 });

			totalRating += rating;

			return {
				id: nanoid(),
				placeId,
				userId,
				rating,
				content: faker.lorem.paragraph(),
			};
		});

		batch.push(...smallBatch);

		updates[placeId] = {
			totalVotes: n,
			totalPoints: totalRating,
		};
	}

	await db.transaction(async (tx) => {
		await tx.insert(schema.reviews).values(batch);

		const values = Object.entries(updates).map(
			([placeId, { totalVotes, totalPoints }]) =>
				`('${placeId.replaceAll("'", "''")}', ${totalVotes}, ${totalPoints})`,
		);

		if (values.length > 0) {
			const sqlText = `
				UPDATE places AS p
				SET
					"totalVotes" = v.total_votes,
					"totalPoints" = v.total_points
				FROM (
					VALUES ${values.join(', ')}
				) AS v(id, total_votes, total_points)
				WHERE p.id = v.id;
			`;

			await tx.execute(sqlText);
		}
	});
}
