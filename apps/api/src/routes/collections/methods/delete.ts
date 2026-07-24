import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class DeleteCollectionMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.DeleteInput,
	): Promise<Collections.dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.collections)
			.where(eq(schema.collections.id, data.id));

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);

		return {};
	}
}
