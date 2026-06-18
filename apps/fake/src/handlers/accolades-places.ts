import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { paths } from '..';
import { readFile } from '../utils';
import { getDb } from './common';

type Insert = z.infer<typeof $insert.accoladeAssignment>;

export async function generate() {
	const accoladeIds = await readFile(paths.accolades);
	const placeIds = await readFile(paths.places);
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		if (Math.random() < 0.9) {
			continue; // Skip most places to create a more realistic distribution of accolades
		}

		const randomAccoladeIds = faker.helpers.arrayElements(accoladeIds, {
			min: 1,
			max: 3,
		});

		batch.push(...randomAccoladeIds.map((accoladeId) => ({
			placeId,
			accoladeId,
			id: nanoid(),
		})));
	}

	const db = await getDb();

	await db.insert(schema.accoladeAssignments).values(batch);
}
