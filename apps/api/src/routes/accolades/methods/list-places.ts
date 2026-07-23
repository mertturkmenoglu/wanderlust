import type { CacheService } from '@wanderlust/cache';
import { Tokens, Types } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { getUserId } from '@/lib/get-user-id';
import { MetadataEnricher } from '@/lib/metadata-enricher';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class ListAccoladePlacesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.listPlaces.handler(async ({ input, context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Accolades.dto.ListPlacesInput,
	): Promise<Accolades.dto.ListPlacesOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.listPlaces(data.id, data.page, data.pageSize),
			factory: async () => this.findAll(data.id, data.page, data.pageSize),
			grace: cacheOptions.grace.listPlaces,
			ttl: cacheOptions.ttl.listPlaces,
		});

		const enrichedPlaces = await this.enrichPlaces(userId, result.places);

		return {
			places: enrichedPlaces,
			pagination: result.pagination,
		};
	}

	private async findAll(id: string, page: number, pageSize: number) {
		const offset = Types.Pagination.getOffset({ page, pageSize });

		const assignments = await findAssignments.execute(this.db, {
			id,
		});

		const places = await this.db.query.places.findMany({
			where: {
				id: {
					in: assignments.map((aa) => aa.placeId),
				},
			},
			with: $includes.place.with,
			offset,
			limit: pageSize,
		});

		return {
			places,
			pagination: Types.Pagination.compute(
				{ page, pageSize },
				assignments.length,
			),
		};
	}

	private async enrichPlaces(
		userId: string | null,
		places: Types.Places.Extended[],
	) {
		const favorites = await this.favorites.getFavoriteStatuses(
			userId,
			places.map((p) => p.id),
		);

		return MetadataEnricher.enrichPlaces(places, favorites);
	}
}

const findAssignments = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.accoladeAssignments
			.findMany({
				where: {
					accoladeId: sql.placeholder('id'),
				},
			})
			.prepare('accolades_find_assignments');
	},
});
