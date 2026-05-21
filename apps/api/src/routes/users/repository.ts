import { ORPCError } from '@orpc/client';
import { CacheService, type TCacheService } from '@wanderlust/cache';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { and, asc, eq, ilike, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class UsersRepository {
	private readonly db: TDatabaseService;
	private readonly cache: TCacheService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(CacheService) cache: CacheService,
	) {
		this.db = db.get();
		this.cache = cache.get();
	}

	async updateImage(
		userId: string,
		type: dto.UpdateImageInput['type'],
		url: string,
	) {
		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.id, userId),
			});

			if (!user) {
				throw new ORPCError('NotFound', {
					message: `User with id ${userId} not found`,
				});
			}

			const previousUrl = type === 'profile' ? user.image : user.banner;

			await this.db
				.update(schema.users)
				.set(type === 'profile' ? { image: url } : { banner: url })
				.where(eq(schema.users.id, userId));

			const result = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.id, userId),
			});

			if (!result) {
				throw new ORPCError('NotFound', {
					message: `User with id ${userId} not found`,
				});
			}

			return {
				profile: result,
				previousUrl,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to update user image',
				cause: err,
			});
		}
	}

	async get(userId: string, data: dto.GetInput) {
		try {
			const result = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!result) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const isSelf = result.id === userId;

			let isFollowing = false;

			if (!isSelf) {
				// Check if the requesting user is following the target user
				const follow = await this.db.query.follows.findFirst({
					where: (t, { eq, and }) =>
						and(eq(t.followerId, userId), eq(t.followingId, result.id)),
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to get user profile',
				cause: err,
			});
		}
	}

	async getMe(userId: string) {
		try {
			const result = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.id, userId),
			});

			if (!result) {
				throw new ORPCError('NotFound', {
					message: `User with id ${userId} not found`,
				});
			}

			return {
				profile: result,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to get current user profile',
				cause: err,
			});
		}
	}

	async getRole(userId: string) {
		try {
			const result = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.id, userId),
			});

			if (!result) {
				throw new ORPCError('NotFound', {
					message: `User with id ${userId} not found`,
				});
			}

			const role = result.role === 'admin' ? 'admin' : 'user';

			return {
				role,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to get user role',
				cause: err,
			});
		}
	}

	async listFollowers(_userId: string, data: dto.ListFollowersInput) {
		const offset = Pagination.getOffset(data);

		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const followers = await this.db.query.follows.findMany({
				where: (t, { eq }) => eq(t.followingId, user.id),
				orderBy: (t, { asc }) => [asc(t.createdAt)],
				offset,
				limit: data.pageSize,
				with: {
					follower: {
						columns: {
							id: true,
							username: true,
							name: true,
							image: true,
							banner: true,
							bio: true,
							website: true,
							followersCount: true,
							followingCount: true,
							createdAt: true,
						},
					},
				},
			});

			const totalRecords = await this.db.$count(
				schema.follows,
				eq(schema.follows.followingId, user.id),
			);

			return {
				followers: followers.map((f) => f.follower),
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to list followers',
				cause: err,
			});
		}
	}

	async listFollowing(_userId: string, data: dto.ListFollowingInput) {
		const offset = Pagination.getOffset(data);

		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const following = await this.db.query.follows.findMany({
				where: (t, { eq }) => eq(t.followerId, user.id),
				orderBy: (t, { asc }) => [asc(t.createdAt)],
				offset,
				limit: data.pageSize,
				with: {
					following: {
						columns: {
							id: true,
							username: true,
							name: true,
							image: true,
							banner: true,
							bio: true,
							website: true,
							followersCount: true,
							followingCount: true,
							createdAt: true,
						},
					},
				},
			});

			const totalRecords = await this.db.$count(
				schema.follows,
				eq(schema.follows.followerId, user.id),
			);

			return {
				following: following.map((f) => f.following),
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to list following',
				cause: err,
			});
		}
	}

	async listTopPlaces(_userId: string, data: dto.ListTopPlacesInput) {
		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const topPlaces = await this.db.query.userTopPlaces.findMany({
				where: (t, { eq }) => eq(t.userId, user.id),
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
			});

			return {
				topPlaces: topPlaces.map((tp) => tp.place),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to list top places',
				cause: err,
			});
		}
	}

	async updateTopPlaces(userId: string, data: dto.UpdateTopPlacesInput) {
		try {
			const result = await this.db.transaction(async (tx) => {
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
				const topPlaces = await tx.query.places.findMany({
					where: (t, { inArray }) => inArray(t.id, data.placesIds),
					with: {
						assets: true,
						category: true,
						address: {
							with: {
								city: true,
							},
						},
					},
				});

				return {
					places: topPlaces,
				};
			});

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to update top places',
				cause: err,
			});
		}
	}

	async listActivities(_userId: string, data: dto.ListUserActivitiesInput) {
		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const activities = await this.cache
				.namespace('activities')
				.getOrSetForever({
					key: data.username,
					factory: async () => {
						return [] as Array<Record<string, unknown>>;
					},
				});

			return {
				activities,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to list activities',
				cause: err,
			});
		}
	}

	async searchFollowing(userId: string, data: dto.SearchFollowingInput) {
		try {
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
				.innerJoin(
					schema.users,
					eq(schema.users.id, schema.follows.followingId),
				)
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to search following',
				cause: err,
			});
		}
	}

	async follow(userId: string, data: dto.FollowInput) {
		try {
			const targetUser = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!targetUser) {
				throw new ORPCError('NotFound', {
					message: `User with username ${data.username} not found`,
				});
			}

			const existingFollow = await this.db.query.follows.findFirst({
				where: (t, { eq, and }) =>
					and(eq(t.followerId, userId), eq(t.followingId, targetUser.id)),
			});

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

				const thisUser = await tx.query.users.findFirst({
					where: (t, { eq }) => eq(t.id, userId),
				});

				if (!thisUser) {
					throw new ORPCError('NotFound', {
						message: `User with id ${userId} not found`,
					});
				}

				const activities = await this.cache
					.namespace('activities')
					.getOrSetForever({
						key: data.username,
						factory: async () => {
							return [] as Array<Record<string, unknown>>;
						},
					});

				activities.unshift({
					type: 'follow',
					data: {
						thisUsername: thisUser.username,
						otherUsername: targetUser.username,
					},
				});

				await this.cache.namespace('activities').set({
					key: data.username,
					value: activities.slice(0, 100),
				});

				return true;
			});

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to follow/unfollow user',
				cause: err,
			});
		}
	}

	async update(userId: string, data: dto.UpdateInput) {
		try {
			const result = await this.db
				.update(schema.users)
				.set({
					name: data.name,
					bio: data.bio,
					website: data.website,
				})
				.where(eq(schema.users.id, userId))
				.returning();

			const first = result[0];

			if (!first) {
				throw new ORPCError('NotFound', {
					message: `User with id ${userId} not found`,
				});
			}

			return {
				profile: first,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('InternalServerError', {
				message: 'Failed to update user',
				cause: err,
			});
		}
	}
}
