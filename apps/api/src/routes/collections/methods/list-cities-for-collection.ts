import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class ListCitiesForCollectionMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.relations.cities
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.RelationsCitiesInput,
	): Promise<Collections.dto.RelationsCitiesOutput> {
		const result = await this.db.query.collectionsCities.findMany({
			where: {
				collectionId: data.id,
			},
			with: {
				city: true,
			},
		});

		return {
			cities: result.map((r) => r.city),
		};
	}
}
