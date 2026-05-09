import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { readFile } from '@/lib/fake/utils';
import { paths } from '..';

type Insert = z.infer<typeof $insert.collectionsCities>;

export async function generate() {
	const collectionIds = await readFile(paths.collections);
	const db = container.get(DatabaseService).get();

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

	try {
		await db.insert(schema.collectionsCities).values(batch);
	} catch (_err) {
		// Key collision errors are expected here due to the random nature of the data generation
		// Ignore the error
	}
}
