import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { and, eq, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import {
	findFollowsRelation,
	findUserById,
	findUserByUsername,
} from '../shared/statements';

@injectable()
export class FollowMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.follow.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.FollowInput,
	): Promise<Users.dto.FollowOutput> {
		const targetUser = await findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			targetUser,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const existingFollow = await findFollowsRelation.execute(this.db, {
			followerId: userId,
			followingId: targetUser.id,
		});

		if (existingFollow) {
			const result = await this.db.transaction(async (tx) => {
				// Unfollow
				await tx
					.delete(schema.follows)
					.where(
						and(
							eq(schema.follows.followerId, userId),
							eq(schema.follows.followingId, targetUser.id),
						),
					);

				// Decrement follower count
				await tx
					.update(schema.users)
					.set({
						followersCount: sql`${schema.users.followersCount} - 1`,
					})
					.where(eq(schema.users.id, targetUser.id));

				// Decrement following count
				await tx
					.update(schema.users)
					.set({
						followingCount: sql`${schema.users.followingCount} - 1`,
					})
					.where(eq(schema.users.id, userId));

				return false;
			});

			return {
				isFollowing: result,
			};
		}

		const result = await this.db.transaction(async (tx) => {
			// Follow
			await tx.insert(schema.follows).values({
				followerId: userId,
				followingId: targetUser.id,
			});

			// Increment follower count
			await tx
				.update(schema.users)
				.set({
					followersCount: sql`${schema.users.followersCount} + 1`,
				})
				.where(eq(schema.users.id, targetUser.id));

			// Increment following count
			await tx
				.update(schema.users)
				.set({
					followingCount: sql`${schema.users.followingCount} + 1`,
				})
				.where(eq(schema.users.id, userId));

			const thisUser = await findUserById.execute(tx, {
				id: userId,
			});

			invariant(thisUser, 'NOT_FOUND', `User with id ${userId} not found`);

			await this.activities.addActivity(thisUser.username, 'follow', {
				thisUsername: thisUser.username,
				otherUsername: targetUser.username,
			});

			await this.jobs.notifications.queue.add('create-notification', {
				id: nanoid(),
				type: 'user_follow',
				recipientId: targetUser.id,
				entityId: thisUser.id,
				entityType: 'user',
				readAt: null,
				createdAt: new Date(),
				data: {
					follower: {
						id: thisUser.id,
						username: thisUser.username,
						name: thisUser.name,
						image: thisUser.image,
					},
				},
			});

			return true;
		});

		return {
			isFollowing: result,
		};
	}
}
