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
export class UpdateCollectionMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.UpdateInput,
	): Promise<Collections.dto.UpdateOutput> {
		const [result] = await this.db
			.update(schema.collections)
			.set({
				name: data.name,
				description: data.description,
			})
			.where(eq(schema.collections.id, data.id))
			.returning();

		invariant(result, 'NOT_FOUND', `Collection with id ${data.id} not found`);

		return {
			collection: result,
		};
	}
}
