import { ORPCError } from '@orpc/server';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { and, eq, ilike, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class PlacesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async get(data: dto.GetInput) {
		const place = await this.db.query.places.findFirst({
			where: (t) => eq(t.id, data.id),
			with: $includes.place,
		});

		if (!place) {
			throw new ORPCError('NOT_FOUND', {
				message: `Place with ID ${data.id} not found`,
			});
		}

		return place;
	}

	async isFavorite(placeId: string, userId: string): Promise<boolean> {
		const fav = await this.db.query.favorites.findFirst({
			where: (t) => and(eq(t.placeId, placeId), eq(t.userId, userId)),
		});

		return fav !== undefined;
	}

	async isBookmarked(placeId: string, userId: string): Promise<boolean> {
		const bookmark = await this.db.query.bookmarks.findFirst({
			where: (t) => and(eq(t.placeId, placeId), eq(t.userId, userId)),
		});

		return bookmark !== undefined;
	}

	async peek() {
		const place = await this.db.query.places.findMany({
			with: $includes.place,
			offset: 0,
			limit: 25,
			orderBy: (t, { desc }) => desc(t.createdAt),
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

		if (!place) {
			throw new ORPCError('NOT_FOUND', {
				message: `Place with ID ${id} not found`,
			});
		}

		return this.get({ id: place.id });
	}

	async updateAddress(data: dto.UpdateAddressInput) {
		const { id: addressId, ...updateData } = data.address;

		const place = await this.get({ id: data.id });

		const [address] = await this.db
			.update(schema.addresses)
			.set(updateData)
			.where(eq(schema.addresses.id, addressId))
			.returning();

		if (!address) {
			throw new ORPCError('NOT_FOUND', {
				message: `Address for Place ID ${data.id} not found`,
			});
		}

		return this.get({ id: place.id });
	}

	async updateAmenities(data: dto.UpdateAmenitiesInput) {
		const { id, ...updateData } = data;

		const [place] = await this.db
			.update(schema.places)
			.set(updateData)
			.where(eq(schema.places.id, id))
			.returning();

		if (!place) {
			throw new ORPCError('NOT_FOUND', {
				message: `Place with ID ${id} not found`,
			});
		}

		return this.get({ id: place.id });
	}

	async updateHours(data: dto.UpdateHoursInput) {
		const { id, ...updateData } = data;

		const [place] = await this.db
			.update(schema.places)
			.set(updateData)
			.where(eq(schema.places.id, id))
			.returning();

		if (!place) {
			throw new ORPCError('NOT_FOUND', {
				message: `Place with ID ${id} not found`,
			});
		}

		return this.get({ id: place.id });
	}

	async _delete(data: dto.DeleteInput) {
		await this.db.delete(schema.places).where(eq(schema.places.id, data.id));
	}

	async searchAddresses(
		data: dto.SearchAddressesInput,
	): Promise<dto.SearchAddressesOutput> {
		const addresses = await this.db.query.addresses.findMany({
			where: (t, { ilike, or }) =>
				or(
					ilike(t.line1, `%${data.query}%`),
					ilike(t.line2, `%${data.query}%`),
					ilike(t.postalCode, `%${data.query}%`),
				),
			offset: 0,
			limit: 30,
			orderBy: (t, { desc }) => desc(t.id),
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
