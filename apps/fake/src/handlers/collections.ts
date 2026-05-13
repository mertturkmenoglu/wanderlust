import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { getDb } from './common';

const COUNT = 2_000;

type Insert = z.infer<typeof $insert.collection>;

export async function generate() {
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
}
