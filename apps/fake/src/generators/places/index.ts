import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { generateOne } from './one';
import { getAllCities, getCategoryIds } from './queries';

const COUNT = 2_000;
const STEP = 100;

type Insert = Types.Places.$Insert.Place;

export const placesGenerator = defineGenerator({
	generate: async () => {
		let step = STEP;
		const db = await getDb();
		const categoryIds = await getCategoryIds();
		const cities = await getAllCities();

		for (let i = 0; i < COUNT; i += step) {
			if (i + step > COUNT) {
				step = COUNT - i;
			}

			const batch: Insert[] = [];

			for (let j = 0; j < step; j++) {
				batch.push(generateOne(categoryIds, cities));
			}

			await db.insert(schema.places).values(batch).onConflictDoNothing();
		}
	},
});

export const placeAssetsGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();
		const places = await Fake.File.read('places');

		const assets = await db.query.assets.findMany({
			where: {
				bucket: 'places',
			},
			columns: {
				id: true,
			},
		});

		const chunks = Fake.Chunk.fromArray(places, 100);

		for (const chunk of chunks) {
			const batch: Types.Assets.$Insert.AssetToPlaceInsert[] = [];

			for (const placeId of chunk) {
				const sample = faker.helpers.arrayElements(assets, {
					min: 5,
					max: 10,
				});

				batch.push(
					...sample.map((a, i) => ({
						assetId: a.id,
						placeId: placeId,
						order: i,
					})),
				);
			}

			await db.insert(schema.assetsToPlaces).values(batch);
		}
	},
});
