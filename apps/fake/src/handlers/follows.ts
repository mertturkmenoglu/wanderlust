import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { count, eq, inArray } from 'drizzle-orm';
import type z from 'zod';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';
import { getDb } from './common';

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
	const db = await getDb();
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

async function processFollows(userIds: string[]) {
	const db = await getDb();

	return db.transaction(async (tx) => {
		const followingRows = await tx
			.select({ userId: schema.follows.followerId, cnt: count() })
			.from(schema.follows)
			.where(inArray(schema.follows.followerId, userIds))
			.groupBy(schema.follows.followerId);

		const followersRows = await tx
			.select({ userId: schema.follows.followingId, cnt: count() })
			.from(schema.follows)
			.where(inArray(schema.follows.followingId, userIds))
			.groupBy(schema.follows.followingId);

		const followingMap = new Map(followingRows.map((r) => [r.userId, r.cnt]));
		const followersMap = new Map(followersRows.map((r) => [r.userId, r.cnt]));

		for (const userId of userIds) {
			await tx
				.update(schema.users)
				.set({
					followingCount: followingMap.get(userId) ?? 0,
					followersCount: followersMap.get(userId) ?? 0,
				})
				.where(eq(schema.users.id, userId));
		}
	});
}
