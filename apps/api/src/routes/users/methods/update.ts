import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class UpdateMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.UpdateInput,
	): Promise<Users.dto.UpdateOutput> {
		const result = await this.db
			.update(schema.users)
			.set({
				name: data.name,
				bio: data.bio,
				website: data.website,
				location: data.location,
			})
			.where(eq(schema.users.id, userId))
			.returning();

		const first = result[0];

		invariant(first, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: first,
		};
	}
}
