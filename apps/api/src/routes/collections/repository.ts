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
		data: dto.ItemsAppendInput,
	): Promise<dto.ItemsAppendOutput> {
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
		data: dto.ItemsRemoveInput,
	): Promise<dto.ItemsRemoveOutput> {
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
		data: dto.ItemsReorderInput,
	): Promise<dto.ItemsReorderOutput> {
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

	async listCollectionsForPlace(
		userId: string | null,
		data: dto.PlacesListInput,
	): Promise<dto.PlacesListOutput> {
		const results = await this.db.query.collectionsPlaces.findMany({
			where: {
				placeId: data.placeId,
			},
			with: {
				collection: {
					with: {
						items: {
							with: {
								place: $includes.place,
							},
						},
					},
				},
			},
		});

		const placeIds = results.flatMap((r) =>
			r.collection.items.map((i) => i.placeId),
		);
		const uniquePlaceIds = unique(placeIds);
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			uniquePlaceIds,
		);

		const collections = results.map((r) => ({
			...r.collection,
			items: attachFavoriteMetadata(r.collection.items, favoriteIds),
		}));

		return {
			collections,
		};
	}

	async appendCollectionToPlace(
		_userId: string,
		data: dto.PlacesAppendInput,
	): Promise<dto.PlacesAppendOutput> {
		const collection = await this.db.transaction(async (tx) => {
			// Check if the association already exists
			const existing = await tx.query.collectionsPlaces.findFirst({
				where: {
					collectionId: data.collectionId,
					placeId: data.placeId,
				},
			});

			invariant(
				!existing,
				'CONFLICT',
				`Collection with id ${data.collectionId} is already associated with place ${data.placeId}`,
			);

			// Fetch the collection to ensure it exists
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

			// Find the last association for the given place to determine the next index
			const lastAssociation = await tx.query.collectionsPlaces.findFirst({
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

			// If there's no existing association, newIndex will be 0; otherwise, increment the last index by 1
			const lastIndex = lastAssociation ? lastAssociation.index : -1;
			const newIndex = lastIndex + 1;

			const [result] = await tx
				.insert(schema.collectionsPlaces)
				.values({
					collectionId: data.collectionId,
					placeId: data.placeId,
					index: newIndex,
				})
				.returning();

			invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

			return collection;
		});

		return {
			collection,
		};
	}

	async reorderCollectionsForPlace(
		_userId: string,
		data: dto.PlacesReorderInput,
	): Promise<dto.PlacesReorderOutput> {
		const result = await this.db.transaction(async (tx) => {
			// Find featured collections for the given place
			const existingAssociations = await tx.query.collectionsPlaces.findMany({
				where: {
					placeId: data.placeId,
				},
			});

			// Check if the input collection IDs match the existing collection IDs for the place
			// Create sets for comparison
			const existingCollectionIds = existingAssociations.map(
				(assoc) => assoc.collectionId,
			);
			const inputCollectionIdsSet = new Set(data.collectionIds);
			const existingCollectionIdsSet = new Set(existingCollectionIds);
			const isSameSet =
				inputCollectionIdsSet.isSupersetOf(existingCollectionIdsSet) &&
				existingCollectionIdsSet.isSupersetOf(inputCollectionIdsSet);

			invariant(
				isSameSet,
				'BAD_REQUEST',
				'Input collection IDs do not match existing collections for the place',
			);

			// Delete existing associations for the place
			await tx
				.delete(schema.collectionsPlaces)
				.where(eq(schema.collectionsPlaces.placeId, data.placeId));

			// Insert new associations with the provided order
			await tx.insert(schema.collectionsPlaces).values(
				data.collectionIds.map((collectionId, index) => ({
					collectionId,
					placeId: data.placeId,
					index: index,
				})),
			);

			// Fetch the collections to return after reordering
			const collections = await tx.query.collections.findMany({
				where: {
					id: {
						in: data.collectionIds,
					},
				},
			});

			return collections;
		});

		return {
			collections: result,
		};
	}

	async removeCollectionFromPlace(
		_userId: string,
		data: dto.PlacesRemoveInput,
	): Promise<dto.PlacesRemoveOutput> {
		const result = await this.db.transaction(async (tx) => {
			// Find the existing association between the collection and place
			const existingAssociation = await tx.query.collectionsPlaces.findFirst({
				where: {
					collectionId: data.collectionId,
					placeId: data.placeId,
				},
			});

			invariant(
				existingAssociation,
				'NOT_FOUND',
				`Collection with id ${data.collectionId} is not associated with place ${data.placeId}`,
			);

			// Delete it
			const deleteResult = await tx
				.delete(schema.collectionsPlaces)
				.where(
					and(
						eq(schema.collectionsPlaces.collectionId, data.collectionId),
						eq(schema.collectionsPlaces.placeId, data.placeId),
					),
				);

			invariant(
				deleteResult.rowCount === 1,
				'INTERNAL_SERVER_ERROR',
				'Failed to delete collection-place association',
			);

			// Update the indices of the remaining associations for the place
			await tx
				.update(schema.collectionsPlaces)
				.set({
					index: sql`${schema.collectionsPlaces.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsPlaces.placeId, data.placeId),
						gt(schema.collectionsPlaces.index, existingAssociation.index),
					),
				);

			return {};
		});

		return result;
	}

	async listCollectionsForCity(
		userId: string | null,
		data: dto.CitiesListInput,
	): Promise<dto.CitiesListOutput> {
		const results = await this.db.query.collectionsCities.findMany({
			where: {
				cityId: data.cityId,
			},
			with: {
				collection: {
					with: {
						items: {
							with: {
								place: $includes.place,
							},
						},
					},
				},
			},
		});

		const placeIds = results.flatMap((r) =>
			r.collection.items.map((i) => i.placeId),
		);
		const uniquePlaceIds = unique(placeIds);
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			uniquePlaceIds,
		);

		const collections = results.map((r) => ({
			...r.collection,
			items: attachFavoriteMetadata(r.collection.items, favoriteIds),
		}));

		return {
			collections,
		};
	}

	async appendCollectionToCity(
		_userId: string,
		data: dto.CitiesAppendInput,
	): Promise<dto.CitiesAppendOutput> {
		const collection = await this.db.transaction(async (tx) => {
			// Check if the association already exists
			const existing = await tx.query.collectionsCities.findFirst({
				where: {
					collectionId: data.collectionId,
					cityId: data.cityId,
				},
			});

			invariant(
				!existing,
				'CONFLICT',
				`Collection with id ${data.collectionId} is already associated with city ${data.cityId}`,
			);

			// Fetch the collection to ensure it exists
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

			// Find the last association for the given city to determine the next index
			const lastAssociation = await tx.query.collectionsCities.findFirst({
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

			// If there's no existing association, newIndex will be 0; otherwise, increment the last index by 1
			const lastIndex = lastAssociation ? lastAssociation.index : -1;
			const newIndex = lastIndex + 1;

			const [result] = await tx
				.insert(schema.collectionsCities)
				.values({
					collectionId: data.collectionId,
					cityId: data.cityId,
					index: newIndex,
				})
				.returning();

			invariant(result, 'INTERNAL_SERVER_ERROR', 'No result returned');

			return collection;
		});

		return {
			collection,
		};
	}

	async reorderCollectionsForCity(
		_userId: string,
		data: dto.CitiesReorderInput,
	): Promise<dto.CitiesReorderOutput> {
		const result = await this.db.transaction(async (tx) => {
			// Find featured collections for the given city
			const existingAssociations = await tx.query.collectionsCities.findMany({
				where: {
					cityId: data.cityId,
				},
			});

			// Check if the input collection IDs match the existing collection IDs for the city
			// Create sets for comparison
			const existingCollectionIds = existingAssociations.map(
				(assoc) => assoc.collectionId,
			);
			const inputCollectionIdsSet = new Set(data.collectionIds);
			const existingCollectionIdsSet = new Set(existingCollectionIds);
			const isSameSet =
				inputCollectionIdsSet.isSupersetOf(existingCollectionIdsSet) &&
				existingCollectionIdsSet.isSupersetOf(inputCollectionIdsSet);

			invariant(
				isSameSet,
				'BAD_REQUEST',
				'Input collection IDs do not match existing collections for the city',
			);

			// Delete existing associations for the city
			await tx
				.delete(schema.collectionsCities)
				.where(eq(schema.collectionsCities.cityId, data.cityId));

			// Insert new associations with the provided order
			await tx.insert(schema.collectionsCities).values(
				data.collectionIds.map((collectionId, index) => ({
					collectionId,
					cityId: data.cityId,
					index: index,
				})),
			);

			// Fetch the collections to return after reordering
			const collections = await tx.query.collections.findMany({
				where: {
					id: {
						in: data.collectionIds,
					},
				},
			});

			return collections;
		});

		return {
			collections: result,
		};
	}

	async removeCollectionFromCity(
		_userId: string,
		data: dto.CitiesRemoveInput,
	): Promise<dto.CitiesRemoveOutput> {
		const result = await this.db.transaction(async (tx) => {
			// Find the existing association between the collection and city
			const existingAssociation = await tx.query.collectionsCities.findFirst({
				where: {
					collectionId: data.collectionId,
					cityId: data.cityId,
				},
			});

			invariant(
				existingAssociation,
				'NOT_FOUND',
				`Collection with id ${data.collectionId} is not associated with city ${data.cityId}`,
			);

			// Delete it
			const deleteResult = await tx
				.delete(schema.collectionsCities)
				.where(
					and(
						eq(schema.collectionsCities.collectionId, data.collectionId),
						eq(schema.collectionsCities.cityId, data.cityId),
					),
				);

			invariant(
				deleteResult.rowCount === 1,
				'INTERNAL_SERVER_ERROR',
				'Failed to delete collection-city association',
			);

			// Update the indices of the remaining associations for the city
			await tx
				.update(schema.collectionsCities)
				.set({
					index: sql`${schema.collectionsCities.index} - 1`,
				})
				.where(
					and(
						eq(schema.collectionsCities.cityId, data.cityId),
						gt(schema.collectionsCities.index, existingAssociation.index),
					),
				);

			return {};
		});

		return result;
	}

	async listPlacesForCollection(
		_userId: string,
		data: dto.RelationsPlacesInput,
	): Promise<dto.RelationsPlacesOutput> {
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

	async listCitiesForCollection(
		_userId: string,
		data: dto.RelationsCitiesInput,
	): Promise<dto.RelationsCitiesOutput> {
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
