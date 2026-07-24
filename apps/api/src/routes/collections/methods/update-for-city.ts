import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class UpdateCollectionsForCityMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.cities.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
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
}
