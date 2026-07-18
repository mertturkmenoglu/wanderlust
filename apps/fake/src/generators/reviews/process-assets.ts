import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { Fake } from '@/lib/fake';

type Insert = Types.Assets.$Insert.Asset;

export async function processChunk({ reviewIds }: { reviewIds: string[] }) {
	const batch: Insert[] = [];

	for (const reviewId of reviewIds) {
		if (Math.random() > 0.3) {
			continue;
		}

		const imageCount = faker.number.int({ min: 1, max: 4 });

		for (let i = 0; i < imageCount; i++) {
			batch.push({
				entityType: 'review',
				entityId: reviewId,
				url: Fake.Random.imageUrl(),
				description: `Photo of review ${reviewId} - ${i + 1}`,
				order: i + 1,
			});
		}
	}

	const db = await getDb();

	if (batch.length > 0) {
		await db.insert(schema.assets).values(batch).onConflictDoNothing();
	}
}
