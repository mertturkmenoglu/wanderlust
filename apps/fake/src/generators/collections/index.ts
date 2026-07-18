import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import pLimit from 'p-limit';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { processItems } from './process-items';
import { processPlaceRelations } from './process-places';
import { getCityIds } from './queries';

const COUNT = 2_000;

type Insert = Types.Collections.$Insert.Collection;

export const collectionsGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();
		const batch: Insert[] = [];

		for (let i = 0; i < COUNT; i++) {
			batch.push({
				id: nanoid(),
				name: faker.lorem.sentence({ min: 2, max: 5 }).replace('.', ''),
				description: faker.lorem.paragraphs({ min: 1, max: 4 }),
			});
		}

		await db.insert(schema.collections).values(batch);
	},
});

export const collectionItemsGenerator = defineGenerator({
	generate: async () => {
		const collections = await Fake.File.read('collections');
		const places = await Fake.File.read('places');
		const chunks = Fake.Chunk.fromArray(collections, 100);

		const results = await Promise.allSettled(
			chunks.map((c) => processItems(c, places)),
		);

		void Fake.Promise.allMustSettle(results);
	},
});

type CityInsert = Types.Collections.$Insert.CityRelation;

export const collectionsCitiesGenerator = defineGenerator({
	generate: async () => {
		const collections = await Fake.File.read('collections');
		const db = await getDb();
		const cities = await getCityIds();

		const batch: CityInsert[] = [];

		for (const cityId of cities) {
			const sample = faker.helpers
				.arrayElements(collections, 10)
				.map((c, i) => ({
					collectionId: c,
					cityId: cityId,
					index: i,
				}));

			batch.push(...sample);
		}

		await db
			.insert(schema.collectionsCities)
			.values(batch)
			.onConflictDoNothing();
	},
});

export const collectionsPlacesGenerator = defineGenerator({
	generate: async () => {
		const collections = await Fake.File.read('collections');
		const places = await Fake.File.read('places');
		const chunks = Fake.Chunk.fromArray(places, 10);
		const limit = pLimit(4);
		const db = await getDb();

		const results = await Promise.allSettled(
			chunks.map((c) => limit(() => processPlaceRelations(db, c, collections))),
		);

		void Fake.Promise.allMustSettle(results);
	},
});
