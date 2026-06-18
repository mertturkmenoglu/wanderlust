import { ORPCError } from '@orpc/client';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import {
	codes,
	DatabaseService,
	isPgError,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, eq, gt, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { FavoritesRepository } from '../favorites/repository';
import type * as dto from './dto';

@injectable()
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

		try {
			const result = await this.db.query.collections.findMany({
				orderBy: (t, { desc }) => [desc(t.createdAt)],
				offset,
				limit: data.pageSize,
			});

			const totalRecords = await this.db.$count(schema.collections);

			return {
				collections: result,
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list collections',
				cause: err,
			});
		}
	}

	async getById(userId: string | null, data: dto.GetInput) {
		try {
			const result = await this.db.query.collections.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
				with: {
					items: {
						orderBy: (t, { asc }) => [asc(t.index)],
						with: {
							place: {
								with: {
									assets: true,
									category: true,
									address: {
										with: {
											city: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!result) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			const placeIds = Array.from(
				new Set([...result.items.map((item) => item.placeId)]),
			);

			const favoriteIds = userId
				? await this.favoritesRepo.getFavoriteStatuses(userId, placeIds)
				: [];

			return {
				...result,
				items: result.items.map((item) => ({
					...item,
					meta: {
						isFavorite: favoriteIds.includes(item.placeId),
					},
				})),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get collection',
				cause: err,
			});
		}
	}

	async create(data: dto.CreateInput) {
		try {
			const [result] = await this.db
				.insert(schema.collections)
				.values({
					name: data.name,
					description: data.description,
					id: nanoid(),
				})
				.returning();

			if (!result) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'No result returned after creating collection',
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create collection',
				cause: err,
			});
		}
	}

	async _delete(data: dto.DeleteInput) {
		try {
			const result = await this.db
				.delete(schema.collections)
				.where(eq(schema.collections.id, data.id));

			if (result.rowCount !== 1) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete collection',
				cause: err,
			});
		}
	}

	async update(data: dto.UpdateInput) {
		try {
			const [result] = await this.db
				.update(schema.collections)
				.set({
					name: data.name,
					description: data.description,
				})
				.where(eq(schema.collections.id, data.id))
				.returning();

			if (!result) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update collection',
				cause: err,
			});
		}
	}

	async appendItem(data: dto.AppendItemInput) {
		try {
			const collection = await this.db.query.collections.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
			});

			if (!collection) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			const lastItem = await this.db.query.collectionItems.findFirst({
				where: (t, { eq }) => eq(t.collectionId, data.id),
				orderBy: (t, { desc }) => [desc(t.index)],
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

			if (!result) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'No result returned after appending collection item',
				});
			}

			const item = await this.db.query.collectionItems.findFirst({
				where: (t, { eq, and }) =>
					and(
						eq(t.collectionId, result.collectionId),
						eq(t.placeId, result.placeId),
					),
				with: {
					place: {
						with: {
							assets: true,
							category: true,
							address: {
								with: {
									city: true,
								},
							},
						},
					},
				},
			});

			if (!item) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to retrieve appended collection item',
				});
			}

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
		try {
			const result = await this.db
				.delete(schema.collectionItems)
				.where(
					and(
						eq(schema.collectionItems.collectionId, data.id),
						eq(schema.collectionItems.placeId, data.placeId),
					),
				);

			if (result.rowCount !== 1) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection item with id ${data.id} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to remove item from collection',
				cause: err,
			});
		}
	}

	async reorderItems(userId: string, data: dto.ReorderItemsInput) {
		try {
			const collection = await this.db.query.collections.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
			});

			if (!collection) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			const existingItems = await this.db.query.collectionItems.findMany({
				where: (t, { eq }) => eq(t.collectionId, data.id),
			});

			const existingPlaceIds = existingItems.map((item) => item.placeId);
			const inputPlaceIdsSet = new Set(data.placeIds);

			if (
				existingPlaceIds.length !== inputPlaceIdsSet.size ||
				!existingPlaceIds.every((id) => inputPlaceIdsSet.has(id))
			) {
				throw new ORPCError('BAD_REQUEST', {
					message: 'Input placeIds do not match existing collection items',
				});
			}

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

			if (!updatedCollection) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to retrieve updated collection after reordering',
				});
			}

			return updatedCollection;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to reorder items in collection',
				cause: err,
			});
		}
	}

	async createPlaceRelation(data: dto.CreatePlaceRelationInput) {
		try {
			const collection = await this.db.query.collections.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
			});

			if (!collection) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			const place = await this.db.query.places.findFirst({
				where: (t, { eq }) => eq(t.id, data.placeId),
			});

			if (!place) {
				throw new ORPCError('NOT_FOUND', {
					message: `Place with id ${data.placeId} not found`,
				});
			}

			const existingRelation = await this.db.query.collectionsPlaces.findFirst({
				where: (t, { and, eq }) =>
					and(eq(t.collectionId, data.id), eq(t.placeId, data.placeId)),
			});

			if (existingRelation) {
				throw new ORPCError('BAD_REQUEST', {
					message: `Relation between collection ${data.id} and place ${data.placeId} already exists`,
				});
			}

			const lastRelation = await this.db.query.collectionsPlaces.findFirst({
				where: (t, { eq }) => eq(t.placeId, data.placeId),
				orderBy: (t, { desc }) => [desc(t.index)],
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create collection-place relation',
				cause: err,
			});
		}
	}

	async deletePlaceRelation(data: dto.DeletePlaceRelationInput) {
		try {
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

				if (result.length !== 1) {
					throw new ORPCError('NOT_FOUND', {
						message: `Collection-Place relation not found for collection id ${data.id} and place id ${data.placeId}`,
					});
				}

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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete collection-place relation',
				cause: err,
			});
		}
	}

	async createCityRelation(data: dto.CreateCityRelationInput) {
		try {
			const collection = await this.db.query.collections.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
			});

			if (!collection) {
				throw new ORPCError('NOT_FOUND', {
					message: `Collection with id ${data.id} not found`,
				});
			}

			const city = await this.db.query.cities.findFirst({
				where: (t, { eq }) => eq(t.id, data.cityId),
			});

			if (!city) {
				throw new ORPCError('NOT_FOUND', {
					message: `City with id ${data.cityId} not found`,
				});
			}

			const existingRelation = await this.db.query.collectionsCities.findFirst({
				where: (t, { and, eq }) =>
					and(eq(t.collectionId, data.id), eq(t.cityId, data.cityId)),
			});

			if (existingRelation) {
				throw new ORPCError('BAD_REQUEST', {
					message: `Relation between collection ${data.id} and city ${data.cityId} already exists`,
				});
			}

			const lastRelation = await this.db.query.collectionsCities.findFirst({
				where: (t, { eq }) => eq(t.cityId, data.cityId),
				orderBy: (t, { desc }) => [desc(t.index)],
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create collection-city relation',
				cause: err,
			});
		}
	}

	async deleteCityRelation(data: dto.DeleteCityRelationInput) {
		try {
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

				if (result.length !== 1) {
					throw new ORPCError('NOT_FOUND', {
						message: `Collection-City relation not found for collection id ${data.id} and city id ${data.cityId}`,
					});
				}

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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete collection-city relation',
				cause: err,
			});
		}
	}

	async listByPlaceId(userId: string | null, data: dto.ListByPlaceIdInput) {
		try {
			const result = await this.db.query.collectionsPlaces.findMany({
				where: (t, { eq }) => eq(t.placeId, data.placeId),
				orderBy: (t, { asc }) => [asc(t.index)],
				with: {
					collection: {
						columns: {
							id: true,
							name: true,
							description: true,
							createdAt: true,
						},
						with: {
							items: {
								orderBy: (t, { asc }) => [asc(t.index)],
								with: {
									place: {
										with: {
											assets: true,
											category: true,
											address: {
												with: {
													city: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});

			const placeIds = Array.from(new Set([...result.flatMap(x => x.collection.items.map(y => y.placeId))]));

			const favoriteIds = userId
				? await this.favoritesRepo.getFavoriteStatuses(userId, placeIds)
				: [];

			return {
				collections: result.map((x) => ({
					...x.collection,
					items: x.collection.items.map((item) => ({
						...item,
						meta: {
							isFavorite: favoriteIds.includes(item.placeId),
						},
					})),
				})),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list collections by place id',
				cause: err,
			});
		}
	}

	async listByCityId(userId: string | null, data: dto.ListByCityIdInput) {
		try {
			const result = await this.db.query.collectionsCities.findMany({
				where: (t, { eq }) => eq(t.cityId, data.cityId),
				orderBy: (t, { asc }) => [asc(t.index)],
				with: {
					collection: {
						columns: {
							id: true,
							name: true,
							description: true,
							createdAt: true,
						},
						with: {
							items: {
								orderBy: (t, { asc }) => [asc(t.index)],
								with: {
									place: {
										with: {
											assets: true,
											category: true,
											address: {
												with: {
													city: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});


			const placeIds = Array.from(new Set([...result.flatMap(x => x.collection.items.map(y => y.placeId))]));

			const favoriteIds = userId
				? await this.favoritesRepo.getFavoriteStatuses(userId, placeIds)
				: [];

			return {
				collections: result.map((x) => ({
					...x.collection,
					items: x.collection.items.map((item) => ({
						...item,
						meta: {
							isFavorite: favoriteIds.includes(item.placeId),
						},
					})),
				})),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list collections by city id',
				cause: err,
			});
		}
	}

	async listAllPlaceCollections(data: dto.ListAllPlaceCollectionsInput) {
		const offset = Pagination.getOffset(data);

		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list collections',
				cause: err,
			});
		}
	}

	async listAllCityCollections(data: dto.ListAllCityCollectionsInput) {
		const offset = Pagination.getOffset(data);

		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list collections',
				cause: err,
			});
		}
	}
}
