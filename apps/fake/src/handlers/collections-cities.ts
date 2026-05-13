import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import type z from 'zod';
import { paths } from '..';
import { readFile } from '../utils';
import { getDb } from './common';

type Insert = z.infer<typeof $insert.collectionsCities>;

export async function generate() {
	const collectionIds = await readFile(paths.collections);
	const db = await getDb();

	const queryResult = await db.query.cities.findMany({
		columns: {
			id: true,
		},
	});

	const cityIds = queryResult.map((city) => city.id);
	const batch: Insert[] = [];

	for (const cityId of cityIds) {
		const sampledCollectionIds = faker.helpers.arrayElements(collectionIds, 10);

		for (let i = 0; i < sampledCollectionIds.length; i++) {
			const collectionId = sampledCollectionIds[i];

			if (!collectionId) continue;

			batch.push({
				collectionId: collectionId,
				cityId: cityId,
				index: i + 1,
			});
		}
	}

	await db.insert(schema.collectionsCities).values(batch).onConflictDoNothing();
}
