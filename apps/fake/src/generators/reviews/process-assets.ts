import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { Fake } from '@/lib/fake';

type Insert = Types.Assets.$Insert.AssetToReviewInsert;

export async function processChunk({ reviewIds }: { reviewIds: string[] }) {
	const db = await getDb();
	const assets = await db.query.assets.findMany({
		where: {
			bucket: 'reviews',
		},
		columns: {
			id: true,
		},
	});

	const chunks = Fake.Chunk.fromArray(reviewIds, 100);

	for (const chunk of chunks) {
		const batch: Insert[] = [];

		for (const reviewId of chunk) {
			if (Math.random() > 0.3) {
				continue;
			}

			const sample = faker.helpers.arrayElements(assets, {
				min: 1,
				max: 4,
			});

			batch.push(
				...sample.map((asset, i) => ({
					assetId: asset.id,
					reviewId,
					order: i,
				})),
			);
		}

		await db.insert(schema.assetsToReviews).values(batch).onConflictDoNothing();
	}
}
