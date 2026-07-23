import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../shared/router';

@injectable()
export class SearchFollowingMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.searchFollowing.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.SearchFollowingInput,
	): Promise<Users.dto.SearchFollowingOutput> {
		const followings = await this.db
			.select({
				id: schema.users.id,
				username: schema.users.username,
				name: schema.users.name,
				image: schema.users.image,
				banner: schema.users.banner,
				bio: schema.users.bio,
				website: schema.users.website,
				location: schema.users.location,
				followersCount: schema.users.followersCount,
				followingCount: schema.users.followingCount,
				createdAt: schema.users.createdAt,
			})
			.from(schema.follows)
			.innerJoin(schema.users, eq(schema.users.id, schema.follows.followingId))
			.where(
				and(
					eq(schema.follows.followerId, userId),
					ilike(schema.users.username, `%${data.username}%`),
				),
			)
			.orderBy(asc(schema.users.username))
			.limit(50);

		return {
			friends: followings,
		};
	}
}
