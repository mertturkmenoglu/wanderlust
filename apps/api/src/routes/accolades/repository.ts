import { Pagination } from '@wanderlust/common';
import type { accolades as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { slugifyWithRandom } from '@/lib/slug';
import { TraceAll } from '@/lib/tracer';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
@TraceAll()
export class AccoladesRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async create(
		_userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
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

	async list(data: dto.ListInput): Promise<dto.ListOutput> {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.accolades.findMany({
			orderBy: {
				title: 'asc',
				createdAt: 'asc',
			},
			offset: offset,
			limit: data.pageSize,
		});

		const totalItems = await this.db.$count(schema.accolades);
		const pagination = Pagination.compute(data, totalItems);

		return {
			accolades: result,
			pagination: pagination,
		};
	}

	async _delete(
		_userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.accolades)
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(result.length === 1, 'NOT_FOUND', 'Accolade not found');

		return {};
	}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
		const accolade = await this.db.query.accolades.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(accolade, 'NOT_FOUND', 'Accolade not found');

		return { accolade };
	}

	async getPlaces(
		userId: string | null,
		data: dto.GetPlacesInput,
	): Promise<dto.GetPlacesOutput> {
		const assignments = await this.db.query.accoladeAssignments.findMany({
			where: {
				accoladeId: data.id,
			},
		});

		const places = await this.db.query.places.findMany({
			where: {
				id: {
					in: assignments.map((aa) => aa.placeId),
				},
			},
			with: schema.$includes.place.with,
			offset: Pagination.getOffset(data),
			limit: data.pageSize,
		});

		const favorites = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			places.map((place) => place.id),
		);

		return {
			places: places.map((place) => ({
				place,
				meta: {
					isFavorite: favorites.includes(place.id),
				},
			})),
			pagination: Pagination.compute(data, assignments.length),
		};
	}

	async update(
		_userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const results = await this.db
			.update(schema.accolades)
			.set({
				badge: data.badge,
				description: data.description,
				image: data.image,
				title: data.title,
			})
			.where(eq(schema.accolades.id, data.id))
			.returning();

		invariant(results.length === 1, 'NOT_FOUND', 'Accolade not found');

		const [updated] = results;

		invariant(updated, 'NOT_FOUND', 'Accolade not found');

		return { accolade: updated };
	}
}
