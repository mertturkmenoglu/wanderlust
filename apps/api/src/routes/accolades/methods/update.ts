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
export class UpdateAccoladeMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update
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
		data: Accolades.dto.UpdateInput,
	): Promise<Accolades.dto.UpdateOutput> {
		const [updated] = await this.db
			.update(schema.accolades)
			.set({
				badge: data.badge,
				description: data.description,
				image: data.image,
				title: data.title,
			})
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(updated, 'NOT_FOUND', 'Accolade not found');

		return { accolade: updated };
	}
}
