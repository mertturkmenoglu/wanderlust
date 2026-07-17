import { Types } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import {
	$includes,
	DatabaseService,
	schema,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { transformFiltersToConditions } from '@/lib/filters-to-conditions';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { TraceAll } from '@/lib/tracer';
import type { DbOrTx } from '@/lib/transactions';
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

	async list(
		_userId: string,
		data: Collections.dto.ListInput,
	): Promise<Collections.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);
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
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	private async findById(userId: string | null, id: string, tx: DbOrTx) {
		const result = await tx.query.collections.findFirst({
			where: {
				id,
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

		invariant(result, 'NOT_FOUND', `Collection with ID ${id} not found`);

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

	async getById(
		userId: string | null,
		data: Collections.dto.GetInput,
	): Promise<Collections.dto.GetOutput> {
		return this.findById(userId, data.id, this.db);
	}

	async create(
		_userId: string,
		data: Collections.dto.CreateInput,
	): Promise<Collections.dto.CreateOutput> {
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

	async delete(
		_userId: string,
		data: Collections.dto.DeleteInput,
	): Promise<Collections.dto.DeleteOutput> {
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
		data: Collections.dto.UpdateInput,
	): Promise<Collections.dto.UpdateOutput> {
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

	async updateItems(
		userId: string,
		data: Collections.dto.ItemsUpdateInput,
	): Promise<Collections.dto.ItemsUpdateOutput> {
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

			if (data.update.op === 'add') {
				const existingItems = await tx.query.collectionItems.findMany({
					where: {
						placeId: {
							in: data.update.items,
						},
					},
				});

				invariant(
					existingItems.length === 0,
					'CONFLICT',
					'Some items already exist in the collection',
				);

				const lastIndex = await this.getLastIndexForCollection(tx, data.id);

				const newItems = data.update.items.map((placeId, index) => ({
					collectionId: data.id,
					placeId,
					index: lastIndex + 1 + index,
				}));

				await tx.insert(schema.collectionItems).values(newItems);

				return this.findById(userId, data.id, tx);
			}

			if (data.update.op === 'remove') {
				const deleteResult = await tx
					.delete(schema.collectionItems)
					.where(
						and(
							eq(schema.collectionItems.collectionId, data.id),
							inArray(schema.collectionItems.placeId, data.update.items),
						),
					)
					.returning();

				const ok = areSetsEqual(
					new Set([...deleteResult.map((x) => x.placeId)]),
					new Set(data.update.items),
				);

				invariant(
					ok,
					'NOT_FOUND',
					'Some items to remove were not found in the collection',
				);

				const remainingItems = await tx.query.collectionItems.findMany({
					where: {
						collectionId: data.id,
					},
					columns: {
						placeId: true,
						index: true,
					},
				});

				const sortedRemainingItems = remainingItems.sort(
					(a, b) => a.index - b.index,
				);

				await tx
					.delete(schema.collectionItems)
					.where(eq(schema.collectionItems.collectionId, data.id));

				await tx.insert(schema.collectionItems).values(
					sortedRemainingItems.map((item, index) => ({
						collectionId: data.id,
						placeId: item.placeId,
						index: index,
					})),
				);

				return this.findById(userId, data.id, tx);
			}

			if (data.update.op === 'move') {
				const existingItems = await tx.query.collectionItems.findMany({
					where: {
						collectionId: data.id,
					},
				});

				const existingPlaceIds = existingItems.map((item) => item.placeId);
				const inputPlaceIdsSet = new Set(data.update.items);
				const existingPlaceIdsSet = new Set(existingPlaceIds);
				const isSameSet = areSetsEqual(inputPlaceIdsSet, existingPlaceIdsSet);

				invariant(
					isSameSet,
					'BAD_REQUEST',
					'Input place IDs do not match existing collection items place IDs',
				);

				const sortedItems = data.update.items.map((placeId, index) => ({
					collectionId: data.id,
					placeId,
					index,
				}));

				await tx
					.delete(schema.collectionItems)
					.where(eq(schema.collectionItems.collectionId, data.id));

				await tx.insert(schema.collectionItems).values(sortedItems);

				return this.findById(userId, data.id, tx);
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation');
		});

		return {
			collection: result.collection,
		};
	}

	async listCollectionsForPlace(
		userId: string | null,
		data: Collections.dto.PlacesListInput,
	): Promise<Collections.dto.PlacesListOutput> {
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

	async updateCollectionsForPlace(
		_userId: string,
		data: Collections.dto.PlacesUpdateInput,
	): Promise<Collections.dto.PlacesUpdateOutput> {
		const result = await this.db.transaction(async (tx) => {
			const place = await tx.query.places.findFirst({
				where: {
					id: data.placeId,
				},
				columns: {
					id: true,
				},
			});

			invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

			if (data.update.op === 'add') {
				const existingAssociations = await tx.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
						collectionId: {
							in: data.update.items,
						},
					},
				});

				invariant(
					existingAssociations.length === 0,
					'CONFLICT',
					'Some collections are already associated with the place',
				);

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

				const lastIndex = lastAssociation ? lastAssociation.index : -1;

				const newAssociations = data.update.items.map(
					(collectionId, index) => ({
						collectionId,
						placeId: data.placeId,
						index: lastIndex + 1 + index,
					}),
				);

				await tx.insert(schema.collectionsPlaces).values(newAssociations);

				return tx.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			if (data.update.op === 'remove') {
				const deleteResult = await tx
					.delete(schema.collectionsPlaces)
					.where(
						and(
							eq(schema.collectionsPlaces.placeId, data.placeId),
							inArray(schema.collectionsPlaces.collectionId, data.update.items),
						),
					)
					.returning();

				const ok = areSetsEqual(
					new Set([...deleteResult.map((x) => x.collectionId)]),
					new Set(data.update.items),
				);

				invariant(
					ok,
					'NOT_FOUND',
					'Some collections to remove were not found for the place',
				);

				const remainingAssociations = await tx.query.collectionsPlaces.findMany(
					{
						where: {
							placeId: data.placeId,
						},
						columns: {
							collectionId: true,
							index: true,
						},
					},
				);

				const sortedRemainingAssociations = remainingAssociations.sort(
					(a, b) => a.index - b.index,
				);

				await tx
					.delete(schema.collectionsPlaces)
					.where(eq(schema.collectionsPlaces.placeId, data.placeId));

				const reinsertedAssociations = sortedRemainingAssociations.map(
					(assoc, index) => ({
						collectionId: assoc.collectionId,
						placeId: data.placeId,
						index,
					}),
				);

				await tx
					.insert(schema.collectionsPlaces)
					.values(reinsertedAssociations);

				return tx.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			if (data.update.op === 'move') {
				const existingAssociations = await tx.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
					},
				});

				const existingCollectionIds = existingAssociations.map(
					(assoc) => assoc.collectionId,
				);
				const inputCollectionIdsSet = new Set(data.update.items);
				const existingCollectionIdsSet = new Set(existingCollectionIds);
				const isSameSet = areSetsEqual(
					inputCollectionIdsSet,
					existingCollectionIdsSet,
				);

				invariant(
					isSameSet,
					'BAD_REQUEST',
					'Input collection IDs do not match existing collections for the place',
				);

				const sortedItems = data.update.items.map((collectionId, index) => ({
					collectionId,
					placeId: data.placeId,
					index,
				}));

				await tx
					.delete(schema.collectionsPlaces)
					.where(eq(schema.collectionsPlaces.placeId, data.placeId));

				await tx.insert(schema.collectionsPlaces).values(sortedItems);

				return tx.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation');
		});

		return {
			placeId: data.placeId,
			collectionIds: result.map((r) => r.collection.id),
		};
	}

	async listCollectionsForCity(
		userId: string | null,
		data: Collections.dto.CitiesListInput,
	): Promise<Collections.dto.CitiesListOutput> {
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

	async updateCollectionsForCity(
		_userId: string,
		data: Collections.dto.CitiesUpdateInput,
	): Promise<Collections.dto.CitiesUpdateOutput> {
		const result = await this.db.transaction(async (tx) => {
			const city = await tx.query.cities.findFirst({
				where: {
					id: data.cityId,
				},
				columns: {
					id: true,
				},
			});

			invariant(city, 'NOT_FOUND', `City with id ${data.cityId} not found`);

			if (data.update.op === 'add') {
				const existingAssociations = await tx.query.collectionsCities.findMany({
					where: {
						cityId: data.cityId,
						collectionId: {
							in: data.update.items,
						},
					},
				});

				invariant(
					existingAssociations.length === 0,
					'CONFLICT',
					'Some collections are already associated with the city',
				);

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

				const lastIndex = lastAssociation ? lastAssociation.index : -1;

				const newAssociations = data.update.items.map(
					(collectionId, index) => ({
						collectionId,
						cityId: data.cityId,
						index: lastIndex + 1 + index,
					}),
				);

				await tx.insert(schema.collectionsCities).values(newAssociations);

				return tx.query.collectionsCities.findMany({
					where: {
						cityId: data.cityId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			if (data.update.op === 'remove') {
				const deleteResult = await tx
					.delete(schema.collectionsCities)
					.where(
						and(
							eq(schema.collectionsCities.cityId, data.cityId),
							inArray(schema.collectionsCities.collectionId, data.update.items),
						),
					)
					.returning();

				const ok = areSetsEqual(
					new Set([...deleteResult.map((x) => x.collectionId)]),
					new Set(data.update.items),
				);

				invariant(
					ok,
					'NOT_FOUND',
					'Some collections to remove were not found for the city',
				);

				const remainingAssociations = await tx.query.collectionsCities.findMany(
					{
						where: {
							cityId: data.cityId,
						},
						columns: {
							collectionId: true,
							index: true,
						},
					},
				);

				const sortedRemainingAssociations = remainingAssociations.sort(
					(a, b) => a.index - b.index,
				);

				await tx
					.delete(schema.collectionsCities)
					.where(eq(schema.collectionsCities.cityId, data.cityId));

				const reinsertedAssociations = sortedRemainingAssociations.map(
					(assoc, index) => ({
						collectionId: assoc.collectionId,
						cityId: data.cityId,
						index,
					}),
				);

				await tx
					.insert(schema.collectionsCities)
					.values(reinsertedAssociations);

				return tx.query.collectionsCities.findMany({
					where: {
						cityId: data.cityId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			if (data.update.op === 'move') {
				const existingAssociations = await tx.query.collectionsCities.findMany({
					where: {
						cityId: data.cityId,
					},
				});

				const existingCollectionIds = existingAssociations.map(
					(assoc) => assoc.collectionId,
				);
				const inputCollectionIdsSet = new Set(data.update.items);
				const existingCollectionIdsSet = new Set(existingCollectionIds);
				const isSameSet = areSetsEqual(
					inputCollectionIdsSet,
					existingCollectionIdsSet,
				);

				invariant(
					isSameSet,
					'BAD_REQUEST',
					'Input collection IDs do not match existing collections for the city',
				);

				const sortedItems = data.update.items.map((collectionId, index) => ({
					collectionId,
					cityId: data.cityId,
					index,
				}));

				await tx
					.delete(schema.collectionsCities)
					.where(eq(schema.collectionsCities.cityId, data.cityId));

				await tx.insert(schema.collectionsCities).values(sortedItems);

				return tx.query.collectionsCities.findMany({
					where: {
						cityId: data.cityId,
					},
					with: {
						collection: {
							columns: {
								id: true,
							},
						},
					},
				});
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation');
		});

		return {
			cityId: data.cityId,
			collectionIds: result.map((r) => r.collection.id),
		};
	}

	async listPlacesForCollection(
		_userId: string,
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

	async listCitiesForCollection(
		_userId: string,
		data: Collections.dto.RelationsCitiesInput,
	): Promise<Collections.dto.RelationsCitiesOutput> {
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

	private async getLastIndexForCollection(
		tx: DbOrTx,
		collectionId: string,
	): Promise<number> {
		const lastItem = await tx.query.collectionItems.findFirst({
			where: {
				collectionId,
			},
			orderBy: {
				index: 'desc',
			},
			columns: {
				index: true,
			},
		});

		return lastItem ? lastItem.index : -1;
	}
}
