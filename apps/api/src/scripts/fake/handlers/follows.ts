import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import type z from 'zod';
import { DatabaseService } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { paths } from '..';

export async function generate() {
	const userIds = await readFile(paths.users);

	const results = await Promise.allSettled(
		chunkArray(userIds, 100).map((chunk) => processChunk(chunk, userIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Error processing chunk:', result.reason);
		}
	}

	const updateResults = await Promise.allSettled(
		chunkArray(userIds, 100).map((chunk) => processFollows(chunk)),
	);

	for (const result of updateResults) {
		if (result.status === 'rejected') {
			console.error('Error updating follows for chunk:', result.reason);
		}
	}
}

type Insert = z.infer<typeof $insert.follows>;

async function processChunk(chunk: string[], allUserIds: string[]) {
	const db = container.get(DatabaseService).get();

	for (const userId of chunk) {
		const batch: Insert[] = [];
		const targets = faker.helpers.arrayElements(allUserIds, 10);

		for (const targetId of targets) {
			if (userId === targetId) continue;

			batch.push({
				followerId: userId,
				followingId: targetId,
			});
		}

		try {
			await db.insert(schema.follows).values(batch);
		} catch (_err) {
			// Key collisions can happen. Ignore them.
		}
	}
}

function processFollows(userIds: string[]) {
	const db = container.get(DatabaseService).get();

	return db.transaction(async (tx) => {
		for (const userId of userIds) {
			const followingCount = await tx.$count(
				schema.follows,
				eq(schema.follows.followerId, userId),
			);
			const followersCount = await tx.$count(
				schema.follows,
				eq(schema.follows.followingId, userId),
			);

			await tx
				.update(schema.users)
				.set({
					followingCount,
					followersCount,
				})
				.where(eq(schema.users.id, userId));
		}
	});
}
