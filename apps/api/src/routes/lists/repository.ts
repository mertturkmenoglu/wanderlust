import { Pagination } from '@wanderlust/common';
import type { lists as dto } from '@wanderlust/contract';
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
import { invariant } from '@/lib/invariant';
import { unique } from '@/lib/unique';
import { FavoritesRepository } from '../favorites/repository';
import { MAX_ITEMS_PER_LIST, MAX_LISTS_PER_USER } from './consts';

@injectable()
export class ListsRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async listAll(userId: string, data: dto.ListAllInput) {
		const offset = Pagination.getOffset(data);

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
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listPublic(data: dto.ListPublicInput) {
		const offset = Pagination.getOffset(data);

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
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async get(userId: string, data: dto.GetInput) {
		const result = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
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

		invariant(result, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canAccess = result.isPublic || result.userId === userId;

		invariant(
			canAccess,
			'FORBIDDEN',
			`You do not have access to list with ID '${data.id}'`,
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

	async checkStatus(userId: string, data: dto.CheckStatusInput) {
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

	async create(userId: string, data: dto.CreateInput) {
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

	async update(userId: string, data: dto.UpdateInput) {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canUpdate = existing.userId === userId;

		invariant(
			canUpdate,
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

	async _delete(userId: string, data: dto.DeleteInput) {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canDelete = existing.userId === userId;

		invariant(
			canDelete,
			'FORBIDDEN',
			'You do not have permission to delete this list',
		);

		await this.db.delete(schema.lists).where(eq(schema.lists.id, data.id));
	}

	async appendItem(userId: string, data: dto.AppendItemInput) {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canModify = existing.userId === userId;

		invariant(
			canModify,
			'FORBIDDEN',
			'You do not have permission to modify this list',
		);

		let lastIndex = await this.db.query.listItems.findFirst({
			where: {
				listId: data.id,
			},
			orderBy: (t, { desc }) => desc(t.index),
			columns: {
				index: true,
			},
		});

		if (!lastIndex) {
			lastIndex = { index: -1 };
		}

		invariant(
			lastIndex.index < MAX_ITEMS_PER_LIST,
			'BAD_REQUEST',
			`List with ID '${data.id}' has reached the maximum number of items (${MAX_ITEMS_PER_LIST})`,
		);

		const [result] = await this.db
			.insert(schema.listItems)
			.values({
				listId: data.id,
				placeId: data.placeId,
				index: lastIndex.index + 1,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No list item returned');

		const listItem = await this.db.query.listItems.findFirst({
			where: {
				listId: result.listId,
				placeId: result.placeId,
			},
			with: {
				place: $includes.place,
			},
		});

		invariant(
			listItem,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the created list item',
		);

		return {
			item: listItem,
		};
	}

	async updateItems(userId: string, data: dto.UpdateItemsInput) {
		const list = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(list, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canModify = list.userId === userId;

		invariant(
			canModify,
			'FORBIDDEN',
			`You do not have permission to modify list with ID '${data.id}'`,
		);

		invariant(
			data.placeIds.length < MAX_ITEMS_PER_LIST,
			'BAD_REQUEST',
			`Cannot have more than ${MAX_ITEMS_PER_LIST} items in a list`,
		);

		await this.db.transaction(async (tx) => {
			// Delete existing items
			await tx
				.delete(schema.listItems)
				.where(eq(schema.listItems.listId, data.id));

			if (data.placeIds.length > 0) {
				// Insert new items
				await tx.insert(schema.listItems).values(
					data.placeIds.map((placeId, index) => ({
						listId: data.id,
						placeId: placeId,
						index: index + 1,
					})),
				);
			}
		});

		const updatedList = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
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
			updatedList,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the updated list',
		);

		return {
			list: updatedList,
		};
	}

	async removeItem(userId: string, data: dto.RemoveItemInput) {
		const list = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(list, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const canModify = list.userId === userId;

		invariant(
			canModify,
			'FORBIDDEN',
			`You do not have permission to modify list with ID '${data.id}'`,
		);

		await this.db.transaction(async (tx) => {
			// Delete the item
			const result = await tx
				.delete(schema.listItems)
				.where(
					and(
						eq(schema.listItems.listId, data.id),
						eq(schema.listItems.placeId, data.placeId),
					),
				)
				.returning();

			invariant(
				result.length === 1,
				'NOT_FOUND',
				`Item with Place ID '${data.placeId}' not found in list with ID '${data.id}'`,
			);

			// Get item
			// biome-ignore lint/style/noNonNullAssertion: TODO
			const item = result[0]!;

			// Update indices of remaining items
			await tx
				.update(schema.listItems)
				.set({
					index: sql`${schema.listItems.index} - 1`,
				})
				.where(
					and(
						eq(schema.listItems.listId, data.id),
						gt(schema.listItems.index, item.index),
					),
				);
		});
	}
}
