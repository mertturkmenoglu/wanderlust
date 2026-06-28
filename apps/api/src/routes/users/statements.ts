import { $includes } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findUserByUsername = definePreparedStatement({
	schema: z.object({
		username: z.string(),
	}),
	statement: (db) => {
		return db.query.users
			.findFirst({
				where: {
					username: { eq: sql.placeholder('username') },
				},
			})
			.prepare('users_find_user_by_username');
	},
});

export const findUserById = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.users
			.findFirst({
				where: {
					id: { eq: sql.placeholder('id') },
				},
			})
			.prepare('users_find_user_by_id');
	},
});

export const findFollowsRelation = definePreparedStatement({
	schema: z.object({
		followerId: z.string(),
		followingId: z.string(),
	}),
	statement: (db) => {
		return db.query.follows
			.findFirst({
				where: {
					followerId: { eq: sql.placeholder('followerId') },
					followingId: { eq: sql.placeholder('followingId') },
				},
			})
			.prepare('users_find_follows_relation');
	},
});

export const findManyFollowers = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
		limit: z.number(),
		offset: z.number(),
	}),
	statement: (db) => {
		return db.query.follows
			.findMany({
				where: {
					followingId: { eq: sql.placeholder('userId') },
				},
				orderBy: {
					createdAt: 'desc',
				},
				limit: sql.placeholder('limit'),
				offset: sql.placeholder('offset'),
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
			})
			.prepare('users_find_many_followers');
	},
});

export const findManyFollowing = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
		limit: z.number(),
		offset: z.number(),
	}),
	statement: (db) => {
		return db.query.follows
			.findMany({
				where: {
					followerId: { eq: sql.placeholder('userId') },
				},
				orderBy: {
					createdAt: 'desc',
				},
				limit: sql.placeholder('limit'),
				offset: sql.placeholder('offset'),
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
			})
			.prepare('users_find_many_following');
	},
});

export const findManyTopPlaces = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.userTopPlaces
			.findMany({
				where: {
					userId: { eq: sql.placeholder('userId') },
				},
				orderBy: {
					index: 'asc',
				},
				with: {
					place: $includes.place,
				},
			})
			.prepare('users_find_many_top_places');
	},
});
