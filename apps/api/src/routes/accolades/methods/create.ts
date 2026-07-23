import { Tokens } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { slugifyWithRandom } from '@/lib/slug';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class CreateAccoladeMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.create
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
		data: Accolades.dto.CreateInput,
	): Promise<Accolades.dto.CreateOutput> {
		const slug = slugifyWithRandom(data.title);

		const [result] = await this.db
			.insert(schema.accolades)
			.values({
				id: slug,
				badge: data.badge,
				description: data.description,
				image: data.image,
				title: data.title,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'Failed to create accolade');

		return { accolade: result };
	}
}
