import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import { findFollowsRelation, findUserById } from '../shared/statements';

@injectable()
export class GetUserByIdMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.getById.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.GetByIdInput,
	): Promise<Users.dto.GetByIdOutput> {
		const result = await findUserById.execute(this.db, {
			id: data.id,
		});

		invariant(result, 'NOT_FOUND', `User with id ${data.id} not found`);

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
