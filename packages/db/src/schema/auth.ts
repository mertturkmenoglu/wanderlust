import * as p from 'drizzle-orm/pg-core';

export const users = p.pgTable(
	'users',
	{
		id: p.text('id').primaryKey(),
		name: p.text('name').notNull(),
		username: p.text('username').notNull().unique(),
		email: p.text('email').notNull().unique(),
		emailVerified: p.boolean('email_verified').notNull(),
		image: p.text('image'),
		banner: p.text('banner'),
		bio: p.text('bio'),
		website: p.text('website'),
		followersCount: p.integer('followers_count').notNull().default(0),
		followingCount: p.integer('following_count').notNull().default(0),
		createdAt: p.timestamp('created_at').notNull().defaultNow(),
		role: p.text('role'),
		location: p.varchar({ length: 32 }),
		banned: p.boolean('banned'),
		banReason: p.text('ban_reason'),
		banExpires: p.timestamp('ban_expires', {
			precision: 6,
			withTimezone: true,
		}),
		updatedAt: p
			.timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [p.index().on(t.email), p.index().on(t.username)],
);

export const sessions = p.pgTable(
	'sessions',
	{
		id: p.text('id').primaryKey(),
		expiresAt: p.timestamp('expires_at').notNull(),
		token: p.text('token').notNull().unique(),
		createdAt: p.timestamp('created_at').notNull(),
		updatedAt: p.timestamp('updated_at').notNull(),
		ipAddress: p.text('ip_address'),
		userAgent: p.text('user_agent'),
		userId: p
			.text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		impersonatedBy: p.text('impersonated_by'),
	},
	(t) => [p.index().on(t.userId), p.index().on(t.token)],
);

export const accounts = p.pgTable(
	'accounts',
	{
		id: p.text('id').primaryKey(),
		accountId: p.text('account_id').notNull(),
		providerId: p.text('provider_id').notNull(),
		userId: p
			.text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		accessToken: p.text('access_token'),
		refreshToken: p.text('refresh_token'),
		idToken: p.text('id_token'),
		accessTokenExpiresAt: p.timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: p.timestamp('refresh_token_expires_at'),
		scope: p.text('scope'),
		password: p.text('password'),
		createdAt: p.timestamp('created_at').notNull(),
		updatedAt: p.timestamp('updated_at').notNull(),
	},
	(t) => [
		p.index().on(t.accountId),
		p.index().on(t.providerId),
		p.index().on(t.userId),
	],
);

export const verifications = p.pgTable(
	'verifications',
	{
		id: p.text('id').primaryKey(),
		identifier: p.text('identifier').notNull(),
		value: p.text('value').notNull(),
		expiresAt: p.timestamp('expires_at').notNull(),
		createdAt: p.timestamp('created_at'),
		updatedAt: p.timestamp('updated_at'),
	},
	(t) => [p.index().on(t.identifier)],
);

export const follows = p.pgTable(
	'follows',
	{
		followerId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		followingId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [p.primaryKey({ columns: [table.followerId, table.followingId] })],
);
