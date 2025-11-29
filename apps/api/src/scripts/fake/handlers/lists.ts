import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { nanoid } from '@/lib/uid';
import { paths } from '..';

export async function generate() {
	const userIds = await readFile(paths.users);

	const chunks = chunkArray(userIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate lists:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.list>;

async function processChunk(userIds: string[]) {
	const db = ioc.resolve(DbProvider.id);

	const batch: Insert[] = [];

	for (const userId of userIds) {
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

	await db.insert(schema.lists).values(batch);
}
