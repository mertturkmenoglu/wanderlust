import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';
import { reviewFacets } from './custom-types';

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

export const assetEntityType = p.pgEnum('asset_entity_type', [
	'place',
	'review',
	'event',
]);

export const assets = p.pgTable(
	'assets',
	{
		id: p.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		entityType: assetEntityType().notNull(),
		entityId: p.text().notNull(),
		url: p.text().notNull(),
		description: p.text(),
		order: p.integer().notNull().default(0),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [p.index().on(table.entityType), p.index().on(table.entityId)],
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

export const categories = p.pgTable('categories', {
	id: p.smallint().primaryKey(),
	name: p.text().notNull().unique(),
	image: p.text().notNull(),
});

export const cities = p.pgTable('cities', {
	id: p.integer().primaryKey(),
	name: p.text().notNull(),
	stateCode: p.text().notNull(),
	stateName: p.text().notNull(),
	countryCode: p.text().notNull(),
	countryName: p.text().notNull(),
	image: p.text().notNull(),
	lat: p.doublePrecision().notNull(),
	lng: p.doublePrecision().notNull(),
	description: p.text().notNull(),
	timezone: p.text().notNull(),
});

export const addresses = p.pgTable('addresses', {
	id: p.integer().generatedAlwaysAsIdentity().primaryKey(),
	cityId: p
		.integer()
		.notNull()
		.references(() => cities.id, { onDelete: 'cascade' }),
	line1: p.text().notNull(),
	line2: p.text(),
	postalCode: p.text(),
	lat: p.doublePrecision().notNull(),
	lng: p.doublePrecision().notNull(),
});

export const accolades = p.pgTable('accolades', {
	id: p.text().primaryKey(),
	title: p.text().notNull(),
	description: p.text().notNull(),
	image: p.text().notNull(),
	badge: p.text().notNull(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: p
		.timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const accoladeAssignments = p.pgTable(
	'accolade_assignments',
	{
		id: p.text().primaryKey(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		accoladeId: p
			.text()
			.notNull()
			.references(() => accolades.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [p.unique().on(t.placeId, t.accoladeId)],
);

export const places = p.pgTable(
	'places',
	{
		id: p.text().primaryKey(),
		name: p.text().notNull(),
		description: p.text().notNull(),
		phone: p.text(),
		website: p.text(),
		addressId: p
			.integer()
			.notNull()
			.references(() => addresses.id, { onDelete: 'cascade' }),
		categoryId: p
			.smallint()
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		priceLevel: p.smallint().notNull(),
		accessibilityLevel: p.smallint().notNull(),
		totalVotes: p.integer().notNull().default(0),
		totalPoints: p.integer().notNull().default(0),
		totalFavorites: p.integer().notNull().default(0),
		hours: p.jsonb().notNull().default('{}').$type<Record<string, string>>(),
		amenities: p.jsonb().notNull().default('[]').$type<string[]>(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.addressId),
		p.index().on(table.categoryId),
		p.index().on(table.createdAt),
		p.index().on(table.name),
	],
);

export const eventAgeRestriction = p.pgEnum('event_age_restriction', [
	'4+',
	'9+',
	'13+',
	'16+',
	'18+',
	'unrated',
]);

export const eventRefundPolicy = p.pgEnum('event_refund_policy', [
	'full-refund',
	'partial-refund',
	'no-refund',
	'conditional',
	'unspecified',
]);

export const eventRecurrenceFrequency = p.pgEnum('event_recurrence_frequency', [
	'no-recurrence',
	'daily',
	'weekly',
	'monthly',
	'annually',
	'seasonal',
	'unspecified',
]);

export const events = p.pgTable(
	'events',
	{
		id: p.text().primaryKey(),
		title: p.text().notNull(),
		startsAt: p.timestamp({ withTimezone: true }).notNull(),
		endsAt: p.timestamp({ withTimezone: true }).notNull(),
		addressId: p
			.integer()
			.notNull()
			.references(() => addresses.id, { onDelete: 'cascade' }),
		description: p.text().notNull(),
		organizerId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		externalUrl: p.text(),
		ageRestriction: eventAgeRestriction().notNull().default('unrated'),
		amenities: p.jsonb().notNull().default('[]').$type<string[]>(),
		refundPolicy: eventRefundPolicy().notNull().default('unspecified'),
		faq: p.jsonb().notNull().default('{}').$type<Record<string, string>>(),
		placeId: p.text().references(() => places.id, { onDelete: 'set null' }),
		isOnline: p.boolean().notNull().default(false),
		recurrence: eventRecurrenceFrequency().notNull().default('unspecified'),
		categories: p.jsonb().notNull().default('[]').$type<string[]>(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.addressId),
		p.index().on(table.organizerId),
		p.index().on(table.createdAt),
		p.index().on(table.title),
	],
);

export const eventTicketOptions = p.pgTable(
	'event_ticket_options',
	{
		id: p.text().primaryKey(),
		eventId: p
			.text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		name: p.text().notNull(),
		description: p.text().notNull(),
		fee: p.integer().notNull(),
		currency: p.text().notNull(),
		totalAvailability: p.integer().notNull(),
		currentAvailability: p.integer().notNull(),
		externalUrl: p.text(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [p.index().on(table.eventId)],
);

export const eventAgendaItems = p.pgTable(
	'event_agenda_items',
	{
		id: p.text().primaryKey(),
		eventId: p
			.text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		startsAt: p.timestamp({ withTimezone: true }).notNull(),
		endsAt: p.timestamp({ withTimezone: true }).notNull(),
		title: p.text().notNull(),
		description: p.text(),
	},
	(table) => [p.index().on(table.eventId)],
);

export const eventLineupItems = p.pgTable(
	'event_lineup_items',
	{
		id: p.text().primaryKey(),
		eventId: p
			.text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		name: p.text().notNull(),
		userId: p.text().references(() => users.id, { onDelete: 'set null' }),
		badge: p.text().notNull(),
		title: p.text(),
		description: p.text(),
		order: p.integer().notNull(),
	},
	(table) => [
		p.index().on(table.eventId),
		p.index().on(table.order),
		p.index().on(table.userId),
	],
);

export const bookmarks = p.pgTable(
	'bookmarks',
	{
		id: p.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [p.unique().on(table.userId, table.placeId)],
);

export const favorites = p.pgTable(
	'favorites',
	{
		id: p.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [p.unique().on(table.userId, table.placeId)],
);

export const collections = p.pgTable('collections', {
	id: p.text().primaryKey(),
	name: p.text().notNull(),
	description: p.text().notNull(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const collectionItems = p.pgTable(
	'collection_items',
	{
		collectionId: p
			.text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.collectionId, table.placeId] }),
		p.unique().on(table.collectionId, table.index),
	],
);

export const collectionsPlaces = p.pgTable(
	'collections_places',
	{
		collectionId: p
			.text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.collectionId, table.placeId] }),
		p.unique().on(table.collectionId, table.index),
		p.index().on(table.placeId),
	],
);

export const collectionsCities = p.pgTable(
	'collections_cities',
	{
		collectionId: p
			.text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		cityId: p
			.integer()
			.notNull()
			.references(() => cities.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.collectionId, table.cityId] }),
		p.unique().on(table.collectionId, table.index),
		p.index().on(table.cityId),
	],
);

export const lists = p.pgTable(
	'lists',
	{
		id: p.text().primaryKey(),
		name: p.text().notNull(),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		isPublic: p.boolean().notNull().default(false),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [p.index().on(table.userId)],
);

export const listItems = p.pgTable(
	'list_items',
	{
		listId: p
			.text()
			.notNull()
			.references(() => lists.id, { onDelete: 'cascade' }),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.listId, table.placeId] }),
		p.unique().on(table.listId, table.index),
	],
);

export const reviews = p.pgTable(
	'reviews',
	{
		id: p.text().primaryKey(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		content: p.text().notNull(),
		facets: reviewFacets('facets').notNull().default([]),
		rating: p.smallint().notNull(),
		totalLikes: p.bigint({ mode: 'number' }).notNull().default(0),
		detectedLanguage: p.text(),
		visitedAt: p.timestamp({ withTimezone: true }).notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.placeId),
		p.index().on(table.userId),
		p.index().on(table.placeId, table.rating), // for rating range + filtering
		p.index().on(table.placeId, table.createdAt), // default sort
		p.index().on(table.placeId, table.totalLikes), // likes sort
		p.check('rating_range', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
		p.check('visited_at_past', sql`${table.visitedAt} <= now()`),
	],
);

export const reviewLikes = p.pgTable(
	'review_likes',
	{
		reviewId: p
			.text()
			.notNull()
			.references(() => reviews.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.reviewId, table.userId] }),
		p.index().on(table.reviewId),
	],
);

export const tripVisibilityLevel = p.pgEnum('trip_visibility_level', [
	'private',
	'friends',
	'public',
]);

export const trips = p.pgTable('trips', {
	id: p.text().primaryKey(),
	ownerId: p
		.text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: p.text().notNull(),
	description: p.text().notNull().default(''),
	visibilityLevel: tripVisibilityLevel().notNull().default('private'),
	requestedAmenities: p.jsonb().notNull().default('[]').$type<string[]>(),
	startAt: p.timestamp({ withTimezone: true }).notNull(),
	endAt: p.timestamp({ withTimezone: true }).notNull(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: p
		.timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const tripRole = p.pgEnum('trip_role', ['member', 'editor']);

export const tripInvites = p.pgTable(
	'trip_invites',
	{
		id: p.text().primaryKey(),
		tripId: p
			.text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		fromId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		toId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		sentAt: p.timestamp({ withTimezone: true }).notNull(),
		expiresAt: p.timestamp({ withTimezone: true }).notNull(),
		tripTitle: p.text().notNull(),
		role: tripRole().notNull(),
	},
	(table) => [
		p.unique().on(table.tripId, table.toId),
		p.index().on(table.toId),
		p.index().on(table.fromId),
		p.index().on(table.tripId),
	],
);

export const tripComments = p.pgTable(
	'trip_comments',
	{
		id: p.text().primaryKey(),
		tripId: p
			.text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		content: p.text().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [p.index().on(table.tripId), p.index().on(table.userId)],
);

export const tripLocations = p.pgTable(
	'trip_locations',
	{
		id: p.text().primaryKey(),
		tripId: p
			.text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		scheduledTime: p.timestamp({ withTimezone: true }).notNull(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		description: p.text().notNull(),
	},
	(table) => [
		p.unique().on(table.tripId, table.placeId, table.scheduledTime),
		p.index().on(table.tripId),
		p.index().on(table.placeId),
	],
);

export const tripParticipants = p.pgTable(
	'trip_participants',
	{
		id: p.text().primaryKey(),
		tripId: p
			.text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: tripRole().notNull(),
	},
	(table) => [p.unique().on(table.tripId, table.userId)],
);

export const reports = p.pgTable(
	'reports',
	{
		id: p.text().primaryKey(),
		resourceId: p.text().notNull(),
		resourceType: p.text().notNull(),
		reporterId: p
			.text()
			.notNull()
			.references(() => users.id),
		reason: p.integer().notNull(),
		description: p.text(),
		resolved: p.boolean().notNull().default(false),
		resolvedAt: p.timestamp({ withTimezone: true }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.reporterId),
		p.index().on(table.resolved),
		p.index().on(table.resolvedAt),
		p.index().on(table.createdAt),
		p.index().on(table.updatedAt),
	],
);

export const userTopPlaces = p.pgTable(
	'user_top_places',
	{
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
	},
	(table) => [
		p.primaryKey({ columns: [table.userId, table.placeId] }),
		p.unique().on(table.userId, table.placeId, table.index),
	],
);

export const eventInterests = p.pgTable(
	'event_interests',
	{
		id: p.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		eventId: p
			.text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [p.unique().on(table.userId, table.eventId)],
);

export const notificationType = p.pgEnum('notification_type', [
	'user_follow',
	'trip_add_user',
	'trip_update',
	'trip_invite',
	'trip_add_comment',
	'wl_event_suggest',
	'wl_list_suggest',
	'wl_system',
]);

export const notificationEntityType = p.pgEnum('notification_entity_type', [
	'place',
	'review',
	'event',
	'list',
	'trip',
	'user',
]);

export const notifications = p.pgTable(
	'notifications',
	{
		id: p.text().notNull().primaryKey(),
		recipientId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: notificationType().notNull(),
		entityType: notificationEntityType().notNull(),
		entityId: p.text().notNull(),
		// biome-ignore lint/suspicious/noExplicitAny: any is ok here
		data: p.jsonb().$type<Record<string, any>>(),
		readAt: p.timestamp({ withTimezone: true }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.recipientId, t.createdAt)],
);

export const notificationChannelType = p.pgEnum('notification_channel_type', [
	'email',
	'in_app',
]);

export const notificationCategoryType = p.pgEnum('notification_category_type', [
	'digest',
	'recommendation',
	'anniversary',
	'upcoming-trips',
]);

export const notificationPreferences = p.pgTable(
	'notification_preferences',
	{
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		channel: notificationChannelType().notNull(),
		category: notificationCategoryType().notNull(),
		enabled: p.boolean().notNull(),
	},
	(t) => [p.primaryKey({ columns: [t.userId, t.channel, t.category] })],
);

export const chatType = p.pgEnum('chat_type', ['direct', 'group']);

export const chatParticipantRole = p.pgEnum('chat_participant_role', [
	'member',
	'admin',
]);

export const messageType = p.pgEnum('message_type', [
	'text', // text only
	'media', // text? + media+ attachments,
	'audio', // audio only
	'sticker', // text? + sticker
	'gif', // text? + gif
	'share', // text? + entity,
	'system', // system message only
]);

export const messageAttachmentType = p.pgEnum('message_attachment_type', [
	'image',
	'video',
	'audio',
]);

export const chatSharedEntityType = p.pgEnum('chat_shared_entity_type', [
	'place',
	'review',
	'event',
	'list',
	'trip',
	'user',
]);

export const chatSystemEventType = p.pgEnum('chat_system_event_type', [
	'conversation_created',
	'member_joined',
	'member_added',
	'member_removed',
	'member_left',
	'role_granted',
	'role_revoked',
	'renamed',
	'description_changed',
	'image_changed',
	'message_pinned',
	'message_unpinned',
]);

export type TMessageMetadata = {
	linkPreview?: {
		url: string;
		title?: string;
		description?: string;
		imageUrl?: string;
		siteName?: string;
	};
	sticker?: {
		id: string;
		packId?: string;
		url: string;
	};
	gif?: {
		provider: 'giphy' | 'tenor';
		id: string;
		url: string;
		width: number;
		height: number;
	};
	// Arbitrary payload for `system` messages (e.g. { targetUserId, oldName })
	system?: Record<string, unknown>;
};

export const chats = p.pgTable(
	'chats',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		type: chatType().notNull(),

		// These fields are for group chats only
		name: p.text(), // optional, should be null for direct chats
		description: p.text(),
		imageUrl: p.text(),

		creatorId: p.text().references(() => users.id, { onDelete: 'set null' }),

		// Pinned message
		pinnedMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		pinnedById: p.text().references(() => users.id, { onDelete: 'set null' }),
		pinnedAt: p.timestamp({ withTimezone: true }),

		// Denormalized last message info for quick access
		lastMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		lastMessageAt: p.timestamp({ withTimezone: true }),

		// Stored as "minUserId:maxUserId" for direct chats, null for group chats
		// This is used to enforce uniqueness of direct chats between two users
		// Multiple nulls are allowed for unique indexes in Postgres.
		directKey: p.text(),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [p.uniqueIndex().on(t.directKey), p.index().on(t.lastMessageAt)],
);

export const chatParticipants = p.pgTable(
	'chat_participants',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		chatId: p
			.uuid()
			.notNull()
			.references(() => chats.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: chatParticipantRole().notNull().default('member'),

		joinedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		leftAt: p.timestamp({ withTimezone: true }),
		invitedById: p.text().references(() => users.id, { onDelete: 'set null' }),

		lastReadMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		lastReadAt: p.timestamp({ withTimezone: true }),

		mutedUntil: p.timestamp({ withTimezone: true }),
		clearedAt: p.timestamp({ withTimezone: true }),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [
		p.uniqueIndex().on(t.chatId, t.userId),
		p.index().on(t.userId),
		p.index().on(t.chatId),
	],
);

export const messages = p.pgTable(
	'messagees',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		chatId: p
			.uuid()
			.notNull()
			.references(() => chats.id, { onDelete: 'cascade' }),
		senderId: p.text().references(() => users.id, { onDelete: 'set null' }),
		type: messageType().notNull().default('text'),
		body: p.text(),
		replyToMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		systemEvent: chatSystemEventType(),
		metadata: p.jsonb().$type<TMessageMetadata>(),
		editedAt: p.timestamp({ withTimezone: true }),
		deletedAt: p.timestamp({ withTimezone: true }),
		deletedById: p.text().references(() => users.id, { onDelete: 'set null' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [
		p.index().on(t.chatId, t.id),
		p.index().on(t.replyToMessageId),
		p.check(
			'check_messages_audio_body',
			sql`${t.type} <> 'audio' OR ${t.body} IS NOT NULL`,
		),
	],
);

export const messageAttachments = p.pgTable(
	'message_attachments',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		type: messageAttachmentType().notNull(),

		storageKey: p.text().notNull(),
		url: p.text().notNull(),
		caption: p.text(),

		mimeType: p.text(),
		sizeBytes: p.bigint({ mode: 'number' }),
		width: p.integer(),
		height: p.integer(),
		durationMs: p.integer(),
		thumbnailKey: p.text(),
		blurhash: p.text(),

		sortOrder: p.integer().notNull().default(0),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.messageId)],
);

export const messageSharedEntities = p.pgTable(
	'message_shared_entities',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		entityType: chatSharedEntityType().notNull(),
		entityId: p.text().notNull(),
		snapshot: p.jsonb().$type<Record<string, unknown>>(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.messageId), p.index().on(t.entityType, t.entityId)],
);

export const messageDeletions = p.pgTable(
	'message_deletions',
	{
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.primaryKey({ columns: [t.messageId, t.userId] })],
);

export const messageReactions = p.pgTable(
	'message_reactions',
	{
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		emoji: p.text().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [
		p.primaryKey({ columns: [t.messageId, t.userId, t.emoji] }),
		p.index().on(t.messageId),
	],
);

export const preferenceUnitsEnum = p.pgEnum('preference_units', [
	'metric',
	'imperial',
]);

export const preferenceMapStyleEnum = p.pgEnum('preference_map_style', [
	'auto',
	'light',
	'dark',
]);

export const preferenceSearchRadiusEnum = p.pgEnum('preference_search_radius', [
	'close',
	'medium',
	'far',
]);

export const preferenceThemeEnum = p.pgEnum('preference_theme', [
	'system',
	'light',
	'dark',
]);

export const preferences = p.pgTable('preferences', {
	userId: p
		.text()
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	units: preferenceUnitsEnum().notNull().default('metric'),
	timezone: p.varchar({ length: 64 }).notNull().default('Etc/UTC'), // There are long IANA timezone names, so we use varchar(64) to be safe
	mapStyle: preferenceMapStyleEnum().notNull().default('auto'),
	searchRadius: preferenceSearchRadiusEnum().notNull().default('close'),
	enableSearchHistory: p.boolean().notNull().default(true),
	enableRecentViews: p.boolean().notNull().default(true),
	theme: preferenceThemeEnum().notNull().default('system'),
});
