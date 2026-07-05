import { CacheService, type TCacheService } from '@wanderlust/cache';
import { Pagination } from '@wanderlust/common';
import type { users as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { and, asc, eq, ilike, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService, type ActivityItem } from '@/lib/activities';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { FavoritesRepository } from '../favorites/repository';
import * as statements from './statements';

@injectable()
@TraceAll()
export class UsersRepository {
	private readonly db: TDatabaseService;
	private readonly cache: TCacheService;
	private readonly jobs: TJobsService;
	private readonly activities: ActivitiesService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(CacheService) cache: CacheService,
		@inject(JobsService) jobs: JobsService,
		@inject(ActivitiesService) activities: ActivitiesService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
		this.cache = cache.get();
		this.jobs = jobs.get();
		this.activities = activities;
	}

	async updateImage(
		userId: string,
		type: dto.UpdateImageInput['type'],
		url: string,
	) {
		const user = await statements.findUserById.execute(this.db, { id: userId });

		invariant(user, 'NOT_FOUND', `User with id ${userId} not found`);

		const previousUrl = type === 'profile' ? user.image : user.banner;

		await this.db
			.update(schema.users)
			.set(type === 'profile' ? { image: url } : { banner: url })
			.where(eq(schema.users.id, userId));

		const result = await statements.findUserById.execute(this.db, {
			id: userId,
		});

		invariant(result, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: result,
			previousUrl,
		};
	}

	async get(userId: string, data: dto.GetInput) {
		const result = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			result,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const isSelf = result.id === userId;

		let isFollowing = false;

		if (!isSelf) {
			// Check if the requesting user is following the target user
			const follow = await statements.findFollowsRelation.execute(this.db, {
				followerId: userId,
				followingId: result.id,
			});

			isFollowing = follow !== undefined;
		}

		return {
			profile: result,
			meta: {
				isFollowing,
				isSelf,
			},
		};
	}

	async getById(userId: string, data: dto.GetByIdInput) {
		const result = await statements.findUserById.execute(this.db, {
			id: data.id,
		});

		invariant(result, 'NOT_FOUND', `User with id ${data.id} not found`);

		const isSelf = result.id === userId;

		let isFollowing = false;

		if (!isSelf) {
			// Check if the requesting user is following the target user
			const follow = await statements.findFollowsRelation.execute(this.db, {
				followerId: userId,
				followingId: result.id,
			});

			isFollowing = follow !== undefined;
		}

		return {
			profile: result,
			meta: {
				isFollowing,
				isSelf,
			},
		};
	}

	async getMe(userId: string) {
		const result = await statements.findUserById.execute(this.db, {
			id: userId,
		});

		invariant(result, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: result,
		};
	}

	async getRole(userId: string) {
		const result = await statements.findUserById.execute(this.db, {
			id: userId,
		});

		invariant(result, 'NOT_FOUND', `User with id ${userId} not found`);

		const role: 'admin' | 'user' = result.role === 'admin' ? 'admin' : 'user';

		return {
			role,
		};
	}

	async listFollowers(_userId: string, data: dto.ListFollowersInput) {
		const offset = Pagination.getOffset(data);

		const user = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const followers = await statements.findManyFollowers.execute(this.db, {
			userId: user.id,
			limit: data.pageSize,
			offset,
		});

		const totalRecords = await this.db.$count(
			schema.follows,
			eq(schema.follows.followingId, user.id),
		);

		return {
			followers: followers.map((f) => f.follower),
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listFollowing(_userId: string, data: dto.ListFollowingInput) {
		const offset = Pagination.getOffset(data);

		const user = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const following = await statements.findManyFollowing.execute(this.db, {
			userId: user.id,
			limit: data.pageSize,
			offset,
		});

		const totalRecords = await this.db.$count(
			schema.follows,
			eq(schema.follows.followerId, user.id),
		);

		return {
			following: following.map((f) => f.following),
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listTopPlaces(userId: string, data: dto.ListTopPlacesInput) {
		const user = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const topPlaces = await statements.findManyTopPlaces.execute(this.db, {
			userId: user.id,
		});

		const placeIds = Array.from(new Set(topPlaces.map((tp) => tp.placeId)));

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			topPlaces: topPlaces.map((tp) => ({
				place: tp.place,
				meta: {
					isFavorite: favoriteIds.includes(tp.placeId),
				},
			})),
		};
	}

	async updateTopPlaces(userId: string, data: dto.UpdateTopPlacesInput) {
		const result = await this.db.transaction(async (tx) => {
			const user = await statements.findUserById.execute(tx, { id: userId });

			invariant(user, 'NOT_FOUND', `User with id ${userId} not found`);

			// Delete existing top places
			await tx
				.delete(schema.userTopPlaces)
				.where(eq(schema.userTopPlaces.userId, userId));

			// Only try to insert if there are places to insert
			if (data.placesIds.length !== 0) {
				// Insert new top places
				const inserts = data.placesIds.map((placeId, index) => ({
					userId,
					placeId,
					index: index + 1,
				}));

				await tx.insert(schema.userTopPlaces).values(inserts);
			}

			// Fetch and return the updated top places
			const topPlaces = await statements.findManyTopPlaces.execute(tx, {
				userId,
			});

			const places = topPlaces.map((tp) => tp.place);
			const favorites = await this.favoritesRepo.getFavoriteStatuses(
				userId,
				places.map((p) => p.id),
			);

			const enrichedPlaces = topPlaces.map((tp) => ({
				place: tp.place,
				meta: {
					isFavorite: favorites.includes(tp.placeId),
				},
			}));

			return {
				places: enrichedPlaces,
			};
		});

		return result;
	}

	async listActivities(_userId: string, data: dto.ListUserActivitiesInput) {
		const user = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const activities = await this.cache
			.namespace('activities')
			.getOrSetForever({
				key: data.username,
				factory: async () => {
					return [] as ActivityItem[];
				},
			});

		return {
			activities,
		};
	}

	async searchFollowing(userId: string, data: dto.SearchFollowingInput) {
		const followings = await this.db
			.select({
				id: schema.users.id,
				username: schema.users.username,
				name: schema.users.name,
				image: schema.users.image,
				banner: schema.users.banner,
				bio: schema.users.bio,
				website: schema.users.website,
				followersCount: schema.users.followersCount,
				followingCount: schema.users.followingCount,
				createdAt: schema.users.createdAt,
			})
			.from(schema.follows)
			.innerJoin(schema.users, eq(schema.users.id, schema.follows.followingId))
			.where(
				and(
					eq(schema.follows.followerId, userId),
					ilike(schema.users.username, `%${data.username}%`),
				),
			)
			.orderBy(asc(schema.users.username))
			.limit(50);

		return {
			followings: followings,
		};
	}

	async follow(userId: string, data: dto.FollowInput) {
		const targetUser = await statements.findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			targetUser,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const existingFollow = await statements.findFollowsRelation.execute(
			this.db,
			{
				followerId: userId,
				followingId: targetUser.id,
			},
		);

		if (existingFollow) {
			const result = await this.db.transaction(async (tx) => {
				// Unfollow
				await tx
					.delete(schema.follows)
					.where(
						and(
							eq(schema.follows.followerId, userId),
							eq(schema.follows.followingId, targetUser.id),
						),
					);

				// Decrement follower count
				await tx
					.update(schema.users)
					.set({
						followersCount: sql`${schema.users.followersCount} - 1`,
					})
					.where(eq(schema.users.id, targetUser.id));

				// Decrement following count
				await tx
					.update(schema.users)
					.set({
						followingCount: sql`${schema.users.followingCount} - 1`,
					})
					.where(eq(schema.users.id, userId));

				return false;
			});

			return result;
		}
		const result = await this.db.transaction(async (tx) => {
			// Follow
			await tx.insert(schema.follows).values({
				followerId: userId,
				followingId: targetUser.id,
			});

			// Increment follower count
			await tx
				.update(schema.users)
				.set({
					followersCount: sql`${schema.users.followersCount} + 1`,
				})
				.where(eq(schema.users.id, targetUser.id));

			// Increment following count
			await tx
				.update(schema.users)
				.set({
					followingCount: sql`${schema.users.followingCount} + 1`,
				})
				.where(eq(schema.users.id, userId));

			const thisUser = await statements.findUserById.execute(tx, {
				id: userId,
			});

			invariant(thisUser, 'NOT_FOUND', `User with id ${userId} not found`);

			await this.activities.addActivity(thisUser.username, 'follow', {
				thisUsername: thisUser.username,
				otherUsername: targetUser.username,
			});

			await this.jobs.notification.queue.add('create-notification', {
				id: nanoid(),
				type: 'user_follow',
				recipientId: targetUser.id,
				entityId: thisUser.id,
				entityType: 'user',
				readAt: null,
				createdAt: new Date(),
				data: {
					follower: {
						id: thisUser.id,
						username: thisUser.username,
						name: thisUser.name,
						image: thisUser.image,
					},
				},
			});

			return true;
		});

		return result;
	}

	async update(userId: string, data: dto.UpdateInput) {
		const result = await this.db
			.update(schema.users)
			.set({
				name: data.name,
				bio: data.bio,
				website: data.website,
				location: data.location,
			})
			.where(eq(schema.users.id, userId))
			.returning();

		const first = result[0];

		invariant(first, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: first,
		};
	}

	async checkUsernameAvailability(
		data: dto.CheckUsernameAvailabilityInput,
	): Promise<dto.CheckUsernameAvailabilityOutput> {
		const result = await this.db
			.select({ id: schema.users.id })
			.from(schema.users)
			.where(eq(schema.users.username, data.username))
			.limit(1);

		return {
			available: result.length === 0,
		};
	}
}
