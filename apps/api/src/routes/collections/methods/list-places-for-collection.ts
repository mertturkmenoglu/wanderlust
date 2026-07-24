import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../internal/router';

@injectable()
export class ListPlacesForCollectionMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.relations.places
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Collections.dto.RelationsPlacesInput,
	): Promise<Collections.dto.RelationsPlacesOutput> {
		const result = await this.db.query.collectionsPlaces.findMany({
			where: {
				collectionId: data.id,
			},
			with: {
				place: $includes.place,
			},
		});

		return {
			places: result.map((r) => r.place),
		};
	}
}
