import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { count, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/lib/common';

type Insert = Types.Users.$Insert.Follow;

export async function processChunk(chunk: string[], allUserIds: string[]) {
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

export async function processFollows(userIds: string[]) {
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
