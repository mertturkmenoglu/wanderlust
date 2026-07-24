import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../internal/router';

@injectable()
export class CreateCollectionMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.CreateInput,
	): Promise<Collections.dto.CreateOutput> {
		const [result] = await this.db
			.insert(schema.collections)
			.values({
				name: data.name,
				description: data.description,
				id: nanoid(),
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

		return {
			collection: result,
		};
	}
}
