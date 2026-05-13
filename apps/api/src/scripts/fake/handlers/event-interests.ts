import { faker } from '@faker-js/faker';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { DatabaseService } from '@/lib/db';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';

type Insert = z.infer<typeof $insert.eventInterest>;

export async function generate() {
	const userIds = await readFile(paths.users);
	const eventIds = await readFile(paths.events);

	const chunks = chunkArray(userIds, 200);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk, eventIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate event interests', {
				cause: result.reason,
			});
		}
	}
}

async function processChunk(userIds: string[], eventIds: string[]) {
	const db = container.get(DatabaseService).get();
	const batch: Insert[] = [];

	for (const userId of userIds) {
		const n = faker.number.int({ min: 0, max: 10 });
		if (n === 0) continue;

		const picked = faker.helpers.arrayElements(eventIds, n);

		for (const eventId of picked) {
			batch.push({ userId, eventId });
		}
	}

	if (batch.length > 0) {
		await db.insert(schema.eventInterests).values(batch).onConflictDoNothing();
	}
}
