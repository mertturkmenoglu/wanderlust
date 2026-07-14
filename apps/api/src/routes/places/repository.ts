import { Pagination } from '@wanderlust/common';
import type { places as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { eq, ilike, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import {
	findBookmarkByPlaceIdAndUserId,
	findFavoriteByPlaceIdAndUserId,
	findPlaceById,
} from './statements';

@injectable()
@TraceAll()
export class PlacesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async get(data: dto.GetInput) {
		const place = await findPlaceById.execute(this.db, { id: data.id });

		invariant(place, 'NOT_FOUND', `Place with ID ${data.id} not found`);

		return place;
	}

	async getMeta(placeId: string, userId: string) {
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

	async isFavorite(placeId: string, userId: string): Promise<boolean> {
		const fav = await this.db.query.favorites.findFirst({
			columns: {
				id: true,
			},
			where: {
				placeId: placeId,
				userId: userId,
			},
		});

		return fav !== undefined;
	}

	async isBookmarked(placeId: string, userId: string): Promise<boolean> {
		const bookmark = await this.db.query.bookmarks.findFirst({
			columns: {
				id: true,
			},
			where: {
				placeId: placeId,
				userId: userId,
			},
		});

		return bookmark !== undefined;
	}

	async list() {
		const place = await this.db.query.places.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			offset: 0,
			limit: 25,
			with: $includes.place.with,
		});

		return place;
	}

	async update(data: dto.UpdateInput) {
		const { id, ...updateData } = data;

		const [place] = await this.db
			.update(schema.places)
			.set(updateData)
			.where(eq(schema.places.id, id))
			.returning();

		invariant(place, 'NOT_FOUND', `Place with ID ${id} not found`);

		return this.get({ id: place.id });
	}

	async _delete(data: dto.DeleteInput) {
		await this.db.delete(schema.places).where(eq(schema.places.id, data.id));
	}

	async searchAddresses(
		data: dto.SearchAddressesInput,
	): Promise<dto.SearchAddressesOutput> {
		const addresses = await this.db.query.addresses.findMany({
			where: {
				OR: [
					{
						line1: { ilike: `%${data.query}%` },
					},
					{
						line2: { ilike: `%${data.query}%` },
					},
					{
						postalCode: { ilike: `%${data.query}%` },
					},
				],
			},
			orderBy: {
				id: 'desc',
			},
			offset: 0,
			limit: 30,
		});

		const totalRecords = await this.db.$count(
			schema.addresses,
			or(
				ilike(schema.addresses.line1, `%${data.query}%`),
				ilike(schema.addresses.line2, `%${data.query}%`),
				ilike(schema.addresses.postalCode, `%${data.query}%`),
			),
		);

		const pagination = Pagination.compute(
			{ page: 1, pageSize: 30 },
			totalRecords,
		);

		return {
			addresses,
			pagination,
		};
	}
}
