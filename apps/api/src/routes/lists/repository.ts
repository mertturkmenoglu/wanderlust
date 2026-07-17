import { Types } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
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
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { TraceAll } from '@/lib/tracer';
import type { DbOrTx } from '@/lib/transactions';
import { unique } from '@/lib/unique';
import { FavoritesRepository } from '../favorites/repository';
import { canDelete, canRead, canUpdate } from './authz';
import { MAX_ITEMS_PER_LIST, MAX_LISTS_PER_USER } from './consts';

@injectable()
@TraceAll()
export class ListsRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async listAll(userId: string, data: Lists.dto.ListInput) {
		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.lists.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset: offset,
			limit: data.pageSize,
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		const totalRecords = await this.db.$count(
			schema.lists,
			eq(schema.lists.userId, userId),
		);

		return {
			lists: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	async listPublic(data: Lists.dto.ListPublicInput) {
		const offset = Types.Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: {
				username: data.username,
			},
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username '${data.username}' not found`,
		);

		const result = await this.db.query.lists.findMany({
			where: {
				userId: user.id,
				isPublic: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset: offset,
			limit: data.pageSize,
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		const totalRecords = await this.db.$count(
			schema.lists,
			and(eq(schema.lists.userId, user.id), eq(schema.lists.isPublic, true)),
		);

		return {
			lists: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	private async findById(userId: string, listId: string, tx: DbOrTx) {
		const result = await tx.query.lists.findFirst({
			where: {
				id: listId,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				items: {
					orderBy: (t, { asc }) => asc(t.index),
					with: {
						place: $includes.place,
					},
				},
			},
		});

		invariant(result, 'NOT_FOUND', `List with ID '${listId}' not found`);

		const hasReadPermission = canRead(result, userId);

		invariant(
			hasReadPermission,
			'FORBIDDEN',
			`You do not have access to list with ID '${listId}'`,
		);

		const placeIds = unique(result.items.map((item) => item.placeId));
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			list: {
				...result,
				items: attachFavoriteMetadata(result.items, favoriteIds),
			},
		};
	}

	async get(userId: string, data: Lists.dto.GetInput) {
		return this.findById(userId, data.id, this.db);
	}

	async checkStatus(userId: string, data: Lists.dto.ListPlaceSaveStatInput) {
		const listIds = await this.db.query.lists.findMany({
			where: {
				userId: userId,
			},
			columns: {
				id: true,
				name: true,
			},
		});

		const statuses = await this.db.query.listItems.findMany({
			where: {
				placeId: data.placeId,
				listId: {
					in: listIds.map((l) => l.id),
				},
			},
			columns: {
				listId: true,
			},
		});

		const mapped = listIds.map((l) => ({
			id: l.id,
			name: l.name,
			includes: statuses.some((s) => s.listId === l.id),
		}));

		return {
			statuses: mapped,
		};
	}

	async create(userId: string, data: Lists.dto.CreateInput) {
		const count = await this.db.$count(
			schema.lists,
			eq(schema.lists.userId, userId),
		);

		invariant(
			count < MAX_LISTS_PER_USER,
			'BAD_REQUEST',
			`You have reached the maximum number of lists (${MAX_LISTS_PER_USER})`,
		);

		const [result] = await this.db
			.insert(schema.lists)
			.values({
				id: nanoid(),
				userId: userId,
				name: data.name,
				isPublic: data.isPublic,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No list returned');

		const list = await this.db.query.lists.findFirst({
			where: {
				id: result.id,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		invariant(
			list,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the created list',
		);

		return {
			list,
		};
	}

	async update(userId: string, data: Lists.dto.UpdateInput) {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const hasUpdatePermission = canUpdate(existing, userId);

		invariant(
			hasUpdatePermission,
			'FORBIDDEN',
			'You do not have permission to update this list',
		);

		const [updated] = await this.db
			.update(schema.lists)
			.set({
				name: data.name,
				isPublic: data.isPublic,
			})
			.where(eq(schema.lists.id, data.id))
			.returning();

		invariant(updated, 'INTERNAL_SERVER_ERROR', 'No list returned');

		const list = await this.db.query.lists.findFirst({
			where: {
				id: updated.id,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		invariant(
			list,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the updated list',
		);

		return {
			list,
		};
	}

	async _delete(userId: string, data: Lists.dto.DeleteInput) {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const hasDeletePermission = canDelete(existing, userId);

		invariant(
			hasDeletePermission,
			'FORBIDDEN',
			'You do not have permission to delete this list',
		);

		await this.db.delete(schema.lists).where(eq(schema.lists.id, data.id));
	}

	async updateItems(
		userId: string,
		data: Lists.dto.ItemsUpdateInput,
	): Promise<Lists.dto.ItemsUpdateOutput> {
		const result = await this.db.transaction(async (tx) => {
			const list = await this.findById(userId, data.id, tx);

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

				return this.findById(userId, data.id, tx);
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

				return this.findById(userId, data.id, tx);
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

				return this.findById(userId, data.id, tx);
			}

			invariant(false, 'BAD_REQUEST', 'Invalid operation type');
		});

		return {
			list: result.list,
		};
	}
}
