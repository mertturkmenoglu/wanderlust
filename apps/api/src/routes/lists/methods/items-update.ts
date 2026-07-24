import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { ListProvider } from '../provides/list';
import { canUpdate } from '../shared/authz';
import { MAX_ITEMS_PER_LIST } from '../shared/consts';
import { os } from '../shared/router';

@injectable()
export class UpdateListItemsMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ListProvider) private readonly listProvider: ListProvider,
	) {}

	route() {
		return os.items.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Lists.dto.ItemsUpdateInput,
	): Promise<Lists.dto.ItemsUpdateOutput> {
		const result = await this.db.transaction(async (tx) => {
			const list = await this.listProvider.find({
				userId,
				listId: data.id,
				tx,
			});

			invariant(list, 'NOT_FOUND', `List with ID '${data.id}' not found`);

			const hasUpdatePermission = canUpdate(list.list, userId);

			invariant(
				hasUpdatePermission,
				'FORBIDDEN',
				`You do not have permission to modify list with ID '${data.id}'`,
			);

			const currentItemCount = list.list.items.length;

			if (data.update.op === 'add') {
				invariant(
					currentItemCount + data.update.items.length <= MAX_ITEMS_PER_LIST,
					'BAD_REQUEST',
					`Cannot have more than ${MAX_ITEMS_PER_LIST} items in a list`,
				);

				const existingItems = await tx.query.listItems.findMany({
					where: {
						listId: data.id,
					},
					columns: {
						placeId: true,
						index: true,
					},
				});

				const existingPlaceIds = existingItems.map((item) => item.placeId);

				if (existingPlaceIds.some((x) => data.update.items.includes(x))) {
					invariant(
						false,
						'BAD_REQUEST',
						'Some of the places you are trying to add are already in the list',
					);
				}

				const lastIndex = existingItems
					.map((item) => item.index)
					.reduce((a, b) => Math.max(a, b), 0);

				await tx.insert(schema.listItems).values(
					data.update.items.map((placeId, index) => ({
						listId: data.id,
						placeId: placeId,
						index: lastIndex + index + 1,
					})),
				);

				return this.listProvider.find({
					userId,
					listId: data.id,
					tx,
				});
			}

			if (data.update.op === 'remove') {
				const deleteResult = await tx
					.delete(schema.listItems)
					.where(
						and(
							eq(schema.listItems.listId, data.id),
							inArray(schema.listItems.placeId, data.update.items),
						),
					)
					.returning();

				const ok = areSetsEqual(
					new Set([...deleteResult.map((x) => x.placeId)]),
					new Set([...data.update.items]),
				);

				invariant(
					ok,
					'BAD_REQUEST',
					'Some of the places you are trying to remove are not in the list',
				);

				const remainingItems = await tx.query.listItems.findMany({
					where: {
						listId: data.id,
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
					.delete(schema.listItems)
					.where(eq(schema.listItems.listId, data.id));

				await tx.insert(schema.listItems).values(
					sortedRemainingItems.map((item, index) => ({
						listId: data.id,
						placeId: item.placeId,
						index: index,
					})),
				);

				return this.listProvider.find({
					userId,
					listId: data.id,
					tx,
				});
			}

			if (data.update.op === 'move') {
				const existingItems = await tx.query.listItems.findMany({
					where: {
						listId: data.id,
					},
					columns: {
						placeId: true,
						index: true,
					},
				});

				const existingPlaceIds = existingItems.map((item) => item.placeId);
				const inputPlaceIdsSet = new Set(data.update.items);
				const existingPlaceIdsSet = new Set(existingPlaceIds);

				invariant(
					areSetsEqual(inputPlaceIdsSet, existingPlaceIdsSet),
					'BAD_REQUEST',
					'The provided list of place IDs does not match the existing items in the list',
				);

				const sortedItems = data.update.items.map((placeId, index) => ({
					listId: data.id,
					placeId: placeId,
					index: index,
				}));

				await tx
					.delete(schema.listItems)
					.where(eq(schema.listItems.listId, data.id));

				await tx.insert(schema.listItems).values(sortedItems);

				return this.listProvider.find({
					userId,
					listId: data.id,
					tx,
				});
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation type');
		});

		return {
			list: result.list,
		};
	}
}
