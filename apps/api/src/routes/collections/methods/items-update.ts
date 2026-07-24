import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import type { DbOrTx } from '@/lib/transactions';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../internal/router';
import { CollectionProvider } from '../provides/collection';

@injectable()
export class ItemsUpdateMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(CollectionProvider) private readonly provider: CollectionProvider,
	) {}

	route() {
		return os.items.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ context, input }) => {
				const userId = getUserIdOrThrow(context);
				const result = await this.execute(userId, input);

				return result;
			});
	}

	private async execute(
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
				return this.add({
					tx,
					placeIds: data.update.items,
					collectionId: data.id,
					userId,
				});
			}

			if (data.update.op === 'remove') {
				return this.remove({
					tx,
					collectionId: data.id,
					userId,
					placeIds: data.update.items,
				});
			}

			if (data.update.op === 'move') {
				return this.move({
					tx,
					userId,
					collectionId: data.id,
					placeIds: data.update.items,
				});
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation');
		});

		return {
			collection: result.collection,
		};
	}

	private async add({
		tx,
		placeIds,
		collectionId,
		userId,
	}: {
		tx: DbOrTx;
		placeIds: string[];
		collectionId: string;
		userId: string;
	}) {
		const existingItems = await tx.query.collectionItems.findMany({
			where: {
				collectionId: collectionId,
				placeId: {
					in: placeIds,
				},
			},
		});

		invariant(
			existingItems.length === 0,
			'CONFLICT',
			'Some items already exist in the collection',
		);

		const lastIndex = await this.getLastIndexForCollection(tx, collectionId);

		const newItems = placeIds.map((placeId, index) => ({
			collectionId,
			placeId,
			index: lastIndex + 1 + index,
		}));

		await tx.insert(schema.collectionItems).values(newItems);

		return this.provider.find({
			id: collectionId,
			userId,
			tx,
		});
	}

	private async remove({
		tx,
		collectionId,
		userId,
		placeIds,
	}: {
		tx: DbOrTx;
		collectionId: string;
		userId: string;
		placeIds: string[];
	}) {
		const deleteResult = await tx
			.delete(schema.collectionItems)
			.where(
				and(
					eq(schema.collectionItems.collectionId, collectionId),
					inArray(schema.collectionItems.placeId, placeIds),
				),
			)
			.returning();

		const ok = areSetsEqual(
			new Set([...deleteResult.map((x) => x.placeId)]),
			new Set(placeIds),
		);

		invariant(
			ok,
			'NOT_FOUND',
			'Some items to remove were not found in the collection',
		);

		const remainingItems = await tx.query.collectionItems.findMany({
			where: {
				collectionId: collectionId,
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
			.where(eq(schema.collectionItems.collectionId, collectionId));

		await tx.insert(schema.collectionItems).values(
			sortedRemainingItems.map((item, index) => ({
				collectionId: collectionId,
				placeId: item.placeId,
				index: index,
			})),
		);

		return this.provider.find({
			id: collectionId,
			userId,
			tx,
		});
	}

	private async move({
		tx,
		userId,
		collectionId,
		placeIds,
	}: {
		tx: DbOrTx;
		userId: string;
		collectionId: string;
		placeIds: string[];
	}) {
		const existingItems = await tx.query.collectionItems.findMany({
			where: {
				collectionId: collectionId,
			},
		});

		const existingPlaceIds = existingItems.map((item) => item.placeId);
		const inputPlaceIdsSet = new Set(placeIds);
		const existingPlaceIdsSet = new Set(existingPlaceIds);
		const isSameSet = areSetsEqual(inputPlaceIdsSet, existingPlaceIdsSet);

		invariant(
			isSameSet,
			'BAD_REQUEST',
			'Input place IDs do not match existing collection items place IDs',
		);

		const sortedItems = placeIds.map((placeId, index) => ({
			collectionId,
			placeId,
			index,
		}));

		await tx
			.delete(schema.collectionItems)
			.where(eq(schema.collectionItems.collectionId, collectionId));

		await tx.insert(schema.collectionItems).values(sortedItems);

		return this.provider.find({
			id: collectionId,
			userId,
			tx,
		});
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
