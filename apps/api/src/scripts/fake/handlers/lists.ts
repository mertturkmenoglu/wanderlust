import { faker } from '@faker-js/faker';
import pLimit from 'p-limit';
import type z from 'zod';
import type { TDatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { nanoid } from '@/lib/uid';
import { paths } from '..';
import { getDb } from './common';

export async function generate() {
	const db = await getDb();
	const userIds = await readFile(paths.users);
	const chunks = chunkArray(userIds, 100);
	const limit = pLimit(4);

	const results = await Promise.allSettled(
		chunks.map((chunk) => limit(() => processChunk(db, chunk))),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate lists', {
				cause: result.reason,
			});
		}
	}
}

type Insert = z.infer<typeof $insert.list>;

async function processChunk(db: TDatabaseService, userIds: string[]) {
	const batch: Insert[] = [];

	for (const userId of userIds) {
		if (Math.random() < 0.1) continue; // Randomly skip some users to create more variability

		const listCount = faker.number.int({ min: 1, max: 5 });

		for (let i = 0; i < listCount; i++) {
			batch.push({
				id: nanoid(),
				userId: userId,
				name: faker.lorem.sentence({ min: 2, max: 5 }).replace('.', ''),
				isPublic: faker.datatype.boolean(),
			});
		}
	}

	if (batch.length === 0) return;

	await db.insert(schema.lists).values(batch);
}
