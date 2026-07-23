import { Tokens } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class DeleteAccoladeMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context }) => {
				const userId = getUserIdOrThrow(context);
				const result = await this.execute(userId, input);

				return result;
			});
	}

	private async execute(
		_userId: string,
		data: Accolades.dto.DeleteInput,
	): Promise<Accolades.dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.accolades)
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(result.length === 1, 'NOT_FOUND', 'Accolade not found');

		return {};
	}
}
