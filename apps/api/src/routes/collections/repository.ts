import { Pagination } from '@wanderlust/common';
import type { collections as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, eq, gt, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { transformFiltersToConditions } from '@/lib/filters-to-conditions';
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

	async list(_userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const offset = Pagination.getOffset(data);
		const sortBy = data.sort?.field ?? 'createdAt';
		const filters = data.filter?.filters ?? [];

		const result = await this.db.query.collections.findMany({
			where: {
				OR: transformFiltersToConditions(filters),
			},
			orderBy: {
				[sortBy]: data.sort?.order ?? 'desc',
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

	async getById(
		userId: string | null,
		data: dto.GetInput,
	): Promise<dto.GetOutput> {
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
			collection: {
				...result,
				items: attachFavoriteMetadata(result.items, favoriteIds),
			},
		};
	}

	async create(
		_userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const [result] = await this.db
			.insert(schema.collections)
			.values({
				name: data.name,
				description: data.description,
				id: nanoid(),
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

		return {
			collection: result,
		};
	}

	async _delete(
		_userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.collections)
			.where(eq(schema.collections.id, data.id));

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Collection with id ${data.id} not found`,
		);

		return {};
	}

	async update(
		_userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const [result] = await this.db
			.update(schema.collections)
			.set({
				name: data.name,
				description: data.description,
			})
			.where(eq(schema.collections.id, data.id))
			.returning();

		invariant(result, 'NOT_FOUND', `Collection with id ${data.id} not found`);

		return {
			collection: result,
		};
	}

	async appendItem(
		_userId: string | null,
		data: dto.AppendItemInput,
	): Promise<dto.AppendItemOutput> {
		const result = await this.db.transaction(async (tx) => {
			const collection = await tx.query.collections.findFirst({
				where: {
					id: data.id,
				},
			});

			invariant(
				collection,
				'NOT_FOUND',
				`Collection with id ${data.id} not found`,
			);

			const existingRow = await tx.query.collectionItems.findFirst({
				where: {
					collectionId: data.id,
					placeId: data.placeId,
				},
			});

			invariant(
				!existingRow,
				'CONFLICT',
				`Item with place id ${data.placeId} already exists in collection ${data.id}`,
			);

			const lastItem = await tx.query.collectionItems.findFirst({
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
			const newIndex = lastIndex + 1;

			const [inserted] = await tx
				.insert(schema.collectionItems)
				.values({
					collectionId: data.id,
					placeId: data.placeId,
					index: newIndex,
				})
				.returning();

			invariant(
				inserted,
				'INTERNAL_SERVER_ERROR',
				'Failed to insert collection item',
			);

			const item = await tx.query.collectionItems.findFirst({
				where: {
					collectionId: data.id,
					placeId: data.placeId,
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
		});

		return {
			collectionItem: result,
		};
	}

	async removeItem(
		_userId: string,
		data: dto.RemoveItemInput,
	): Promise<dto.RemoveItemOutput> {
		const result = await this.db.transaction(async (tx) => {
			const existingItem = await tx.query.collectionItems.findFirst({
				where: {
					collectionId: data.id,
					placeId: data.placeId,
				},
			});

			invariant(
				existingItem,
				'NOT_FOUND',
				`Collection item with place id ${data.placeId} not found in collection ${data.id}`,
			);

			const deleteResult = await tx
				.delete(schema.collectionItems)
				.where(
					and(
						eq(schema.collectionItems.collectionId, data.id),
						eq(schema.collectionItems.placeId, data.placeId),
					),
				);

			invariant(
				deleteResult.rowCount === 1,
				'INTERNAL_SERVER_ERROR',
				'Failed to delete collection item',
			);

			await tx
				.update(schema.collectionItems)
				.set({
					index: sql`${schema.collectionItems.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionItems.collectionId, data.id),
						gt(schema.collectionItems.index, existingItem.index),
					),
				);

			return {};
		});

		return result;
	}

	async reorderItems(
		userId: string,
		data: dto.ReorderItemsInput,
	): Promise<dto.ReorderItemsOutput> {
		const result = await this.db.transaction(async (tx) => {
			const collection = await tx.query.collections.findFirst({
				where: {
					id: data.id,
				},
			});

			invariant(
				collection,
				'NOT_FOUND',
				`Collection with id ${data.id} not found`,
			);

			const existingCollectionItems = await tx.query.collectionItems.findMany({
				where: {
					collectionId: data.id,
				},
			});

			const existingPlaceIds = existingCollectionItems.map(
				(item) => item.placeId,
			);
			const inputPlaceIdsSet = new Set(data.placeIds);
			const existingPlaceIdsSet = new Set(existingPlaceIds);
			const isSameSet =
				inputPlaceIdsSet.isSupersetOf(existingPlaceIdsSet) &&
				existingPlaceIdsSet.isSupersetOf(inputPlaceIdsSet);

			invariant(
				isSameSet,
				'BAD_REQUEST',
				'Input place IDs do not match existing collection items place IDs',
			);

			await tx
				.delete(schema.collectionItems)
				.where(eq(schema.collectionItems.collectionId, data.id));

			await tx.insert(schema.collectionItems).values(
				data.placeIds.map((placeId, index) => ({
					collectionId: data.id,
					placeId,
					index: index,
				})),
			);

			const result = await tx.query.collections.findFirst({
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
				collection: {
					...result,
					items: attachFavoriteMetadata(result.items, favoriteIds),
				},
			};
		});

		return result;
	}

	async createPlaceRelation(
		_userId: string | null,
		data: dto.CreateCollectionPlaceRelationInput,
	): Promise<dto.CreateCollectionPlaceRelationOutput> {
		await this.db.transaction(async (tx) => {
			const collection = await tx.query.collections.findFirst({
				where: {
					id: data.collectionId,
				},
			});

			invariant(
				collection,
				'NOT_FOUND',
				`Collection with id ${data.collectionId} not found`,
			);

			const place = await tx.query.places.findFirst({
				where: {
					id: data.placeId,
				},
			});

			invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

			const existingRelation = await tx.query.collectionsPlaces.findFirst({
				where: {
					collectionId: data.collectionId,
					placeId: data.placeId,
				},
			});

			invariant(
				!existingRelation,
				'BAD_REQUEST',
				`Relation between collection ${data.collectionId} and place ${data.placeId} already exists`,
			);

			const lastRelation = await tx.query.collectionsPlaces.findFirst({
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
			const newIndex = lastIndex + 1;

			await tx.insert(schema.collectionsPlaces).values({
				collectionId: data.collectionId,
				placeId: data.placeId,
				index: newIndex,
			});
		});

		const collection = await this.getById(null, { id: data.collectionId });

		return {
			collection: collection.collection,
		};
	}

	async deletePlaceRelation(
		_userId: string | null,
		data: dto.DeleteCollectionPlaceRelationInput,
	): Promise<dto.DeleteCollectionPlaceRelationOutput> {
		await this.db.transaction(async (tx) => {
			const [deleted] = await tx
				.delete(schema.collectionsPlaces)
				.where(
					and(
						eq(schema.collectionsPlaces.collectionId, data.collectionId),
						eq(schema.collectionsPlaces.placeId, data.placeId),
					),
				)
				.returning();

			invariant(
				deleted,
				'NOT_FOUND',
				`Collection-Place relation not found for collection id ${data.collectionId} and place id ${data.placeId}`,
			);

			// Reorder remaining relations
			await tx
				.update(schema.collectionsPlaces)
				.set({
					index: sql`${schema.collectionsPlaces.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsPlaces.placeId, data.placeId),
						gt(schema.collectionsPlaces.index, deleted.index),
					),
				);
		});

		return {};
	}

	async createCityRelation(
		_userId: string | null,
		data: dto.CreateCollectionCityRelationInput,
	): Promise<dto.CreateCollectionCityRelationOutput> {
		const result = await this.db.transaction(async (tx) => {
			const collection = await tx.query.collections.findFirst({
				where: {
					id: data.collectionId,
				},
			});

			invariant(
				collection,
				'NOT_FOUND',
				`Collection with id ${data.collectionId} not found`,
			);

			const city = await tx.query.cities.findFirst({
				where: {
					id: data.cityId,
				},
			});

			invariant(city, 'NOT_FOUND', `City with id ${data.cityId} not found`);

			const existingRelation = await tx.query.collectionsCities.findFirst({
				where: {
					collectionId: data.collectionId,
					cityId: data.cityId,
				},
			});

			invariant(
				!existingRelation,
				'BAD_REQUEST',
				`Relation between collection ${data.collectionId} and city ${data.cityId} already exists`,
			);

			const lastRelation = await tx.query.collectionsCities.findFirst({
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
			const newIndex = lastIndex + 1;

			await tx.insert(schema.collectionsCities).values({
				collectionId: data.collectionId,
				cityId: data.cityId,
				index: newIndex,
			});

			const updatedCollection = await tx.query.collections.findFirst({
				where: {
					id: data.collectionId,
				},
			});

			invariant(
				updatedCollection,
				'NOT_FOUND',
				`Collection with id ${data.collectionId} not found`,
			);

			return updatedCollection;
		});

		return {
			collection: result,
		};
	}

	async deleteCityRelation(
		_userId: string | null,
		data: dto.DeleteCollectionCityRelationInput,
	): Promise<dto.DeleteCollectionCityRelationOutput> {
		await this.db.transaction(async (tx) => {
			const [deleted] = await tx
				.delete(schema.collectionsCities)
				.where(
					and(
						eq(schema.collectionsCities.collectionId, data.collectionId),
						eq(schema.collectionsCities.cityId, data.cityId),
					),
				)
				.returning();

			invariant(
				deleted,
				'NOT_FOUND',
				`Collection-City relation not found for collection id ${data.collectionId} and city id ${data.cityId}`,
			);

			// Reorder remaining relations
			await tx
				.update(schema.collectionsCities)
				.set({
					index: sql`${schema.collectionsCities.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsCities.cityId, data.cityId),
						gt(schema.collectionsCities.index, deleted.index),
					),
				);
		});

		return {};
	}

	async listByPlace(
		userId: string | null,
		data: dto.ListByPlaceInput,
	): Promise<dto.ListByPlaceOutput> {
		const result = await this.db.query.collectionsPlaces.findMany({
			where: {
				placeId: data.id,
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

	async listByCity(
		userId: string | null,
		data: dto.ListByCityInput,
	): Promise<dto.ListByCityOutput> {
		const result = await findManyByCityId.execute(this.db, {
			id: data.id,
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

	async getCollectionPlaceRelation(
		userId: string | null,
		data: dto.GetCollectionPlaceRelationInput,
	): Promise<dto.GetCollectionPlaceRelationOutput> {
		const collection = await this.getById(userId, { id: data.collectionId });

		invariant(
			collection.collection,
			'NOT_FOUND',
			`Collection with id ${data.collectionId} not found`,
		);

		const place = await this.db.query.places.findFirst({
			where: {
				id: data.placeId,
			},
			with: $includes.place.with,
		});

		invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

		return {
			collection: collection.collection,
			place,
		};
	}

	async listCollectionPlaceRelations(
		_userId: string | null,
		data: dto.ListCollectionPlaceRelationsInput,
	): Promise<dto.ListCollectionPlaceRelationsOutput> {
		const result = await this.db.query.collectionsPlaces.findMany({
			where: {
				collectionId: data.collectionId,
			},
			orderBy: {
				index: 'asc',
			},
		});

		const placeIds = result.map((x) => x.placeId);

		const places = await this.db.query.places.findMany({
			where: {
				id: {
					in: placeIds,
				},
			},
			with: $includes.place.with,
		});

		return {
			places,
		};
	}

	async getCollectionCityRelation(
		userId: string | null,
		data: dto.GetCollectionCityRelationInput,
	): Promise<dto.GetCollectionCityRelationOutput> {
		const collection = await this.getById(userId, { id: data.collectionId });

		invariant(
			collection.collection,
			'NOT_FOUND',
			`Collection with id ${data.collectionId} not found`,
		);

		const city = await this.db.query.cities.findFirst({
			where: {
				id: data.cityId,
			},
		});

		invariant(city, 'NOT_FOUND', `City with id ${data.cityId} not found`);

		return {
			collection: collection.collection,
			city,
		};
	}

	async listCollectionCityRelations(
		_userId: string | null,
		data: dto.ListCollectionCityRelationsInput,
	): Promise<dto.ListCollectionCityRelationsOutput> {
		const result = await this.db.query.collectionsCities.findMany({
			where: {
				collectionId: data.collectionId,
			},
			orderBy: {
				index: 'asc',
			},
		});

		const cities = await this.db.query.cities.findMany({
			where: {
				id: {
					in: result.map((x) => x.cityId),
				},
			},
		});

		return {
			cities,
		};
	}
}
