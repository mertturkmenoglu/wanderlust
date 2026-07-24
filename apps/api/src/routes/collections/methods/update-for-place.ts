import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../internal/router';

@injectable()
export class UpdateCollectionsForPlaceMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.places.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
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
}
