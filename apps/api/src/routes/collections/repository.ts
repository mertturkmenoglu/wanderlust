import { ORPCError } from '@orpc/client';
import { Pagination } from '@wanderlust/common';
import type { collections as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	codes,
	DatabaseService,
	isPgError,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, eq, gt, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { unique } from '@/lib/unique';
import { FavoritesRepository } from '../favorites/repository';
import { findManyByCityId } from './statements';

@injectable()
@TraceAll()
export class CollectionsRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async list(data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.collections.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(schema.collections);

		return {
			collections: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async getById(userId: string | null, data: dto.GetInput) {
		const result = await this.db.query.collections.findFirst({
			where: {
				id: data.id,
			},
			with: {
				items: {
					orderBy: {
						index: 'asc',
					},
					with: {
						place: $includes.place,
					},
				},
			},
		});

		invariant(result, 'NOT_FOUND', `Collection with ID ${data.id} not found`);

		const placeIds = unique(result.items.map((item) => item.placeId));
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			...result,
			items: attachFavoriteMetadata(result.items, favoriteIds),
		};
	}

	async create(data: dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.collections)
			.values({
				name: data.name,
				description: data.description,
				id: nanoid(),
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

		return result;
	}

	async _delete(data: dto.DeleteInput) {
		const result = await this.db
			.delete(schema.collections)
			.where(eq(schema.collections.id, data.id));

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);
	}

	async update(data: dto.UpdateInput) {
		const [result] = await this.db
			.update(schema.collections)
			.set({
				name: data.name,
				description: data.description,
			})
			.where(eq(schema.collections.id, data.id))
			.returning();

		invariant(result, 'NOT_FOUND', `Collection with id ${data.id} not found`);

		return result;
	}

	async appendItem(data: dto.AppendItemInput) {
		try {
			const collection = await this.db.query.collections.findFirst({
				where: {
					id: data.id,
				},
			});

			invariant(
				collection,
				'NOT_FOUND',
				`Collection with id ${data.id} not found`,
			);

			const lastItem = await this.db.query.collectionItems.findFirst({
				where: {
					collectionId: data.id,
				},
				orderBy: {
					index: 'desc',
				},
				columns: {
					index: true,
				},
			});

			const lastIndex = lastItem ? lastItem.index : -1;

			const [result] = await this.db
				.insert(schema.collectionItems)
				.values({
					collectionId: data.id,
					placeId: data.placeId,
					index: lastIndex + 1,
				})
				.returning();

			invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

			const item = await this.db.query.collectionItems.findFirst({
				where: {
					collectionId: result.collectionId,
					placeId: result.placeId,
				},
				with: {
					place: $includes.place,
				},
			});

			invariant(
				item,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve appended collection item',
			);

			return {
				...item,
				meta: {
					isFavorite: false,
				},
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			if (isPgError(err)) {
				if (err.cause.code === codes.UNIQUE_VIOLATION) {
					throw new ORPCError('CONFLICT', {
						message: `Item with place id ${data.placeId} already exists in collection ${data.id}`,
					});
				}
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to append item to collection',
				cause: err,
			});
		}
	}

	async removeItem(data: dto.RemoveItemInput) {
		const result = await this.db
			.delete(schema.collectionItems)
			.where(
				and(
					eq(schema.collectionItems.collectionId, data.id),
					eq(schema.collectionItems.placeId, data.placeId),
				),
			);

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Collection item with place id ${data.placeId} not found in collection ${data.id}`,
		);
	}

	async reorderItems(userId: string, data: dto.ReorderItemsInput) {
		const collection = await this.db.query.collections.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(
			collection,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);

		const existingItems = await this.db.query.collectionItems.findMany({
			where: {
				collectionId: data.id,
			},
		});

		const existingPlaceIds = existingItems.map((item) => item.placeId);
		const inputPlaceIdsSet = new Set(data.placeIds);
		const hasSameSize = existingPlaceIds.length === inputPlaceIdsSet.size;
		const hasSameElements = existingPlaceIds.every((id) =>
			inputPlaceIdsSet.has(id),
		);

		invariant(
			hasSameSize && hasSameElements,
			'BAD_REQUEST',
			'Input placeIds do not match existing collection items',
		);

		await this.db.transaction(async (tx) => {
			// Delete all existing items
			await tx
				.delete(schema.collectionItems)
				.where(eq(schema.collectionItems.collectionId, data.id));

			// Re-insert items in the new order
			await tx.insert(schema.collectionItems).values(
				data.placeIds.map((placeId, index) => ({
					collectionId: data.id,
					placeId,
					index: index + 1,
				})),
			);
		});

		const updatedCollection = await this.getById(userId, { id: data.id });

		invariant(
			updatedCollection,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve updated collection after reordering',
		);

		return updatedCollection;
	}

	async createPlaceRelation(data: dto.CreatePlaceRelationInput) {
		const collection = await this.db.query.collections.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(
			collection,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);

		const place = await this.db.query.places.findFirst({
			where: {
				id: data.placeId,
			},
		});

		invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

		const existingRelation = await this.db.query.collectionsPlaces.findFirst({
			where: {
				collectionId: data.id,
				placeId: data.placeId,
			},
		});

		invariant(
			!existingRelation,
			'BAD_REQUEST',
			`Relation between collection ${data.id} and place ${data.placeId} already exists`,
		);

		const lastRelation = await this.db.query.collectionsPlaces.findFirst({
			where: {
				placeId: data.placeId,
			},
			orderBy: {
				index: 'desc',
			},
			columns: {
				index: true,
			},
		});

		const lastIndex = lastRelation ? lastRelation.index : -1;

		await this.db.insert(schema.collectionsPlaces).values({
			collectionId: data.id,
			placeId: data.placeId,
			index: lastIndex + 1,
		});
	}

	async deletePlaceRelation(data: dto.DeletePlaceRelationInput) {
		await this.db.transaction(async (tx) => {
			const result = await tx
				.delete(schema.collectionsPlaces)
				.where(
					and(
						eq(schema.collectionsPlaces.collectionId, data.id),
						eq(schema.collectionsPlaces.placeId, data.placeId),
					),
				)
				.returning();

			invariant(
				result.length === 1,
				'NOT_FOUND',
				`Collection-Place relation not found for collection id ${data.id} and place id ${data.placeId}`,
			);

			// biome-ignore lint/style/noNonNullAssertion: We check length above
			const item = result[0]!;

			// Reorder remaining relations
			await tx
				.update(schema.collectionsPlaces)
				.set({
					index: sql`${schema.collectionsPlaces.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsPlaces.placeId, data.placeId),
						gt(schema.collectionsPlaces.index, item.index),
					),
				);
		});
	}

	async createCityRelation(data: dto.CreateCityRelationInput) {
		const collection = await this.db.query.collections.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(
			collection,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);

		const city = await this.db.query.cities.findFirst({
			where: {
				id: data.cityId,
			},
		});

		invariant(city, 'NOT_FOUND', `City with id ${data.cityId} not found`);

		const existingRelation = await this.db.query.collectionsCities.findFirst({
			where: {
				collectionId: data.id,
				cityId: data.cityId,
			},
		});

		invariant(
			!existingRelation,
			'BAD_REQUEST',
			`Relation between collection ${data.id} and city ${data.cityId} already exists`,
		);

		const lastRelation = await this.db.query.collectionsCities.findFirst({
			where: {
				cityId: data.cityId,
			},
			orderBy: {
				index: 'desc',
			},
			columns: {
				index: true,
			},
		});

		const lastIndex = lastRelation ? lastRelation.index : -1;

		await this.db.insert(schema.collectionsCities).values({
			collectionId: data.id,
			cityId: data.cityId,
			index: lastIndex + 1,
		});
	}

	async deleteCityRelation(data: dto.DeleteCityRelationInput) {
		await this.db.transaction(async (tx) => {
			const result = await tx
				.delete(schema.collectionsCities)
				.where(
					and(
						eq(schema.collectionsCities.collectionId, data.id),
						eq(schema.collectionsCities.cityId, data.cityId),
					),
				)
				.returning();

			invariant(
				result.length === 1,
				'NOT_FOUND',
				`Collection-City relation not found for collection id ${data.id} and city id ${data.cityId}`,
			);

			// biome-ignore lint/style/noNonNullAssertion: We check length above
			const item = result[0]!;

			// Reorder remaining relations
			await tx
				.update(schema.collectionsCities)
				.set({
					index: sql`${schema.collectionsCities.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsCities.cityId, data.cityId),
						gt(schema.collectionsCities.index, item.index),
					),
				);
		});
	}

	async listByPlaceId(userId: string | null, data: dto.ListByPlaceIdInput) {
		const result = await this.db.query.collectionsPlaces.findMany({
			where: {
				placeId: data.placeId,
			},
			orderBy: {
				index: 'asc',
			},
			with: {
				collection: {
					with: {
						items: {
							orderBy: {
								index: 'asc',
							},
							with: {
								place: $includes.place,
							},
						},
					},
				},
			},
		});

		const placeIds = unique(
			result.flatMap((x) => x.collection.items.map((y) => y.placeId)),
		);

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			collections: result.map((x) => ({
				...x.collection,
				items: attachFavoriteMetadata(x.collection.items, favoriteIds),
			})),
		};
	}

	async listByCityId(userId: string | null, data: dto.ListByCityIdInput) {
		const result = await findManyByCityId.execute(this.db, {
			id: data.cityId,
		});

		const placeIds = unique(
			result.flatMap((x) => x.collection.items.map((y) => y.placeId)),
		);

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			collections: result.map((x) => ({
				...x.collection,
				items: attachFavoriteMetadata(x.collection.items, favoriteIds),
			})),
		};
	}

	async listAllPlaceCollections(data: dto.ListAllPlaceCollectionsInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.collectionsPlaces.findMany({
			orderBy: (t, { asc }) => [asc(t.index)],
			offset,
			limit: data.pageSize,
			with: {
				place: {
					columns: {
						name: true,
					},
				},
				collection: true,
			},
		});

		const totalRecords = await this.db.$count(schema.collectionsPlaces);

		return {
			relations: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listAllCityCollections(data: dto.ListAllCityCollectionsInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.collectionsCities.findMany({
			orderBy: (t, { asc }) => [asc(t.index)],
			offset,
			limit: data.pageSize,
			with: {
				city: {
					columns: {
						name: true,
					},
				},
				collection: true,
			},
		});

		const totalRecords = await this.db.$count(schema.collectionsCities);

		return {
			relations: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}
}
