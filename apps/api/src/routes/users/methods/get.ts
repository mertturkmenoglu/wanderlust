import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import { findFollowsRelation, findUserByUsername } from '../shared/statements';

@injectable()
export class GetUserMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.get.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.GetInput,
	): Promise<Users.dto.GetOutput> {
		const result = await findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			result,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const isSelf = result.id === userId;

		let isFollowing = false;

		if (!isSelf) {
			// Check if the requesting user is following the target user
			const follow = await findFollowsRelation.execute(this.db, {
				followerId: userId,
				followingId: result.id,
			});

			isFollowing = follow !== undefined;
		}

		return {
			profile: result,
			meta: {
				isFollowing,
				isSelf,
			},
		};
	}
}
