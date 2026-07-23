import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';
import {
	findBookmarkByPlaceIdAndUserId,
	findFavoriteByPlaceIdAndUserId,
	findPlaceById,
} from '../shared/statements';

@injectable()
export class GetPlaceMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.get.handler(async ({ input, context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Places.dto.GetInput,
	): Promise<Places.dto.GetOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.get(data.id),
			ttl: cacheOptions.ttl.get,
			factory: async () => this.find(data),
			grace: cacheOptions.grace.get,
		});

		if (userId === null) {
			return {
				place: result,
				meta: {
					isBookmarked: false,
					isFavorite: false,
				},
			};
		}

		const meta = await this.getMeta(data.id, userId);

		return {
			place: result,
			meta: meta,
		};
	}

	private async find(data: Places.dto.GetInput) {
		const place = await findPlaceById.execute(this.db, { id: data.id });

		invariant(place, 'NOT_FOUND', `Place with ID ${data.id} not found`);

		return place;
	}

	private async getMeta(placeId: string, userId: string) {
		const meta = await this.db.transaction(async (tx) => {
			const f = await findFavoriteByPlaceIdAndUserId.execute(tx, {
				placeId,
				userId,
			});

			const b = await findBookmarkByPlaceIdAndUserId.execute(tx, {
				placeId,
				userId,
			});

			return {
				isFavorite: f !== undefined,
				isBookmarked: b !== undefined,
			};
		});

		return meta;
	}
}
