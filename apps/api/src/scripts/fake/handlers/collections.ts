import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { nanoid } from '@/lib/uid';

const COUNT = 10_000;

type Insert = z.infer<typeof $insert.collection>;

export async function generate() {
	const db = container.get(DatabaseService).get();
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
