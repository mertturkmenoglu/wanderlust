import { Tokens, Types } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import { findManyFollowing, findUserByUsername } from '../shared/statements';

@injectable()
export class ListFollowingMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.listFollowing.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Users.dto.ListFollowingInput,
	): Promise<Users.dto.ListFollowingOutput> {
		const offset = Types.Pagination.getOffset(data);

		const user = await findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const following = await findManyFollowing.execute(this.db, {
			userId: user.id,
			limit: data.pageSize,
			offset,
		});

		const totalRecords = await this.db.$count(
			schema.follows,
			eq(schema.follows.followerId, user.id),
		);

		return {
			following: following.map((f) => f.following),
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
