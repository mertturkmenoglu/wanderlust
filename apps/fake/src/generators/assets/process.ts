import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { Fake } from '@/lib/fake';

const blur = 'LZMtaS?v_Ns:%MD%WBx]WBV@Rj%M';

export async function processChunk(_placeIds: string[]) {
	const db = await getDb();
	const user = await db.query.users.findFirst({
		where: {
			username: 'hilal',
		},
		columns: {
			id: true,
		},
	});

	if (!user) {
		throw new Error('User hilal not found');
	}

	const userId = user.id;

	// First assets for places
	// Every asset will be uploaded by the same user, hilal, for simplicity. In a better scenario, you might want to assign different users.

	// 100 batches, 100 items each. 10K total
	for (let i = 0; i < 100; i++) {
		const batch: Types.Assets.$Insert.AssetDbInsert[] = [];

		for (let j = 0; j < 100; j++) {
			batch.push({
				bucket: 'places',
				key: faker.string.uuid(),
				mimeType: 'image/jpeg',
				size: 1024,
				url: Fake.Random.imageUrl(),
				alt: `Photo of place ${faker.string.uuid()}`,
				attributions: [],
				blurhash: blur,
				height: 800,
				metadata: {},
				status: 'ready',
				uploadedBy: userId,
				visibility: 'public',
				width: 600,
			});
		}

		await db.insert(schema.assets).values(batch).onConflictDoNothing();
	}

	// Now assets for reviews
	// 100 batches, 100 items each. 10K total
	for (let i = 0; i < 100; i++) {
		const batch: Types.Assets.$Insert.AssetDbInsert[] = [];

		for (let j = 0; j < 100; j++) {
			batch.push({
				bucket: 'reviews',
				key: faker.string.uuid(),
				mimeType: 'image/jpeg',
				size: 1024,
				url: Fake.Random.imageUrl(),
				alt: `Photo of review ${faker.string.uuid()}`,
				attributions: [],
				blurhash: blur,
				height: 800,
				metadata: {},
				status: 'ready',
				uploadedBy: userId,
				visibility: 'public',
				width: 600,
			});
		}

		await db.insert(schema.assets).values(batch).onConflictDoNothing();
	}
}
