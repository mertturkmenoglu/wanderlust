import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import { findUserById } from '../shared/statements';

@injectable()
export class GetMeMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.getMe.handler(async ({ context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(userId: string): Promise<Users.dto.GetMeOutput> {
		const result = await findUserById.execute(this.db, {
			id: userId,
		});

		invariant(result, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: result,
		};
	}
}
