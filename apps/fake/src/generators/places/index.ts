import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { generateOne } from './one';
import { getCategoryIds, getCityIds } from './queries';

const COUNT = 2_000;
const STEP = 100;

type Insert = Types.Places.$Insert.Place;

export const placesGenerator = defineGenerator({
	generate: async () => {
		let step = STEP;
		const db = await getDb();
		const categoryIds = await getCategoryIds();
		const cityIds = await getCityIds();

		for (let i = 0; i < COUNT; i += step) {
			if (i + step > COUNT) {
				step = COUNT - i;
			}

			const batch: Insert[] = [];

			for (let j = 0; j < step; j++) {
				batch.push(generateOne(categoryIds, cityIds));
			}

			await db.insert(schema.places).values(batch).onConflictDoNothing();
		}
	},
});
