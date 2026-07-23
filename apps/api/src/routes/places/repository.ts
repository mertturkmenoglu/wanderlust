import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
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
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async get(data: Places.dto.GetInput) {
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

	async update(data: Places.dto.UpdateInput) {
		const { id, ...updateData } = data;

		const [place] = await this.db
			.update(schema.places)
			.set(updateData)
			.where(eq(schema.places.id, id))
			.returning();

		invariant(place, 'NOT_FOUND', `Place with ID ${id} not found`);

		return this.get({ id: place.id });
	}

	async _delete(data: Places.dto.DeleteInput) {
		await this.db.delete(schema.places).where(eq(schema.places.id, data.id));
	}
}
