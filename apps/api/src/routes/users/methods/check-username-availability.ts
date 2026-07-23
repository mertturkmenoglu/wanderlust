import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class CheckUsernameAvailabilityMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.checkUsernameAvailability.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Users.dto.CheckUsernameAvailabilityInput,
	): Promise<Users.dto.CheckUsernameAvailabilityOutput> {
		const result = await this.db
			.select({ id: schema.users.id })
			.from(schema.users)
			.where(eq(schema.users.username, data.username))
			.limit(1);

		return {
			available: result.length === 0,
		};
	}
}
