import { faker } from '@faker-js/faker';
import { count, eq, inArray } from 'drizzle-orm';
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
	const batch: Insert[] = [];

	for (const userId of chunk) {
		const targets = faker.helpers.arrayElements(allUserIds, 10);

		for (const targetId of targets) {
			if (userId === targetId) continue;

			batch.push({
				followerId: userId,
				followingId: targetId,
			});
		}
	}

	await db.insert(schema.follows).values(batch).onConflictDoNothing();
}

function processFollows(userIds: string[]) {
	const db = container.get(DatabaseService).get();

	return db.transaction(async (tx) => {
		const [followingRows, followersRows] = await Promise.all([
			tx
				.select({ userId: schema.follows.followerId, cnt: count() })
				.from(schema.follows)
				.where(inArray(schema.follows.followerId, userIds))
				.groupBy(schema.follows.followerId),
			tx
				.select({ userId: schema.follows.followingId, cnt: count() })
				.from(schema.follows)
				.where(inArray(schema.follows.followingId, userIds))
				.groupBy(schema.follows.followingId),
		]);

		const followingMap = new Map(followingRows.map((r) => [r.userId, r.cnt]));
		const followersMap = new Map(followersRows.map((r) => [r.userId, r.cnt]));

		await Promise.all(
			userIds.map((userId) =>
				tx
					.update(schema.users)
					.set({
						followingCount: followingMap.get(userId) ?? 0,
						followersCount: followersMap.get(userId) ?? 0,
					})
					.where(eq(schema.users.id, userId)),
			),
		);
	});
}
