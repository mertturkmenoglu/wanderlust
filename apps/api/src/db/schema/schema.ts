import { relations } from 'drizzle-orm';
import {
	bigint,
	boolean,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		username: text('username').notNull().unique(),
		email: text('email').notNull().unique(),
		emailVerified: boolean('email_verified').notNull(),
		image: text('image'),
		banner: text('banner'),
		bio: text('bio'),
		website: text('website'),
		followersCount: integer('followers_count').notNull().default(0),
		followingCount: integer('following_count').notNull().default(0),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [index().on(t.username)],
);

export const usersRelations = relations(users, ({ many }) => ({
	bookmarks: many(bookmarks),
	favorites: many(favorites),
	lists: many(lists),
	reviews: many(reviews),
	trips: many(trips),
	topPlaces: many(userTopPlaces),
}));

export const admins = pgTable('admins', {
	userId: text()
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verifications = pgTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
});

export const assetEntityType = pgEnum('asset_entity_type', [
	'place',
	'review',
	'event',
]);

export const assets = pgTable(
	'assets',
	{
		id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		entityType: assetEntityType().notNull(),
		entityId: text().notNull(),
		url: text().notNull(),
		description: text(),
		order: integer().notNull().default(0),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.entityType), index().on(table.entityId)],
);

export const assetsRelations = relations(assets, ({ one }) => ({
	reviews: one(reviews, {
		fields: [assets.entityId],
		references: [reviews.id],
	}),
	places: one(places, {
		fields: [assets.entityId],
		references: [places.id],
	}),
	event: one(events, {
		fields: [assets.entityId],
		references: [events.id],
	}),
}));

export const follows = pgTable(
	'follows',
	{
		followerId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		followingId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.followerId, table.followingId] })],
);

export const followsRelations = relations(follows, ({ one }) => ({
	follower: one(users, {
		fields: [follows.followerId],
		references: [users.id],
	}),
	following: one(users, {
		fields: [follows.followingId],
		references: [users.id],
	}),
}));

export const categories = pgTable('categories', {
	id: smallint().primaryKey(),
	name: text().notNull().unique(),
	image: text().notNull(),
});

export const cities = pgTable('cities', {
	id: integer().primaryKey(),
	name: text().notNull(),
	stateCode: text().notNull(),
	stateName: text().notNull(),
	countryCode: text().notNull(),
	countryName: text().notNull(),
	image: text().notNull(),
	lat: doublePrecision().notNull(),
	lng: doublePrecision().notNull(),
	description: text().notNull(),
});

export const addresses = pgTable('addresses', {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	cityId: integer()
		.notNull()
		.references(() => cities.id, { onDelete: 'cascade' }),
	line1: text().notNull(),
	line2: text(),
	postalCode: text(),
	lat: doublePrecision().notNull(),
	lng: doublePrecision().notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
	city: one(cities, {
		fields: [addresses.cityId],
		references: [cities.id],
	}),
}));

export const places = pgTable(
	'places',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		description: text().notNull(),
		phone: text(),
		website: text(),
		addressId: integer()
			.notNull()
			.references(() => addresses.id, { onDelete: 'cascade' }),
		categoryId: smallint()
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		priceLevel: smallint().notNull(),
		accessibilityLevel: smallint().notNull(),
		totalVotes: integer().notNull().default(0),
		totalPoints: integer().notNull().default(0),
		totalFavorites: integer().notNull().default(0),
		hours: jsonb().notNull().default('{}').$type<Record<string, string>>(),
		amenities: jsonb().notNull().default('[]').$type<string[]>(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		index().on(table.addressId),
		index().on(table.categoryId),
		index().on(table.createdAt),
		index().on(table.name),
	],
);

export const placesRelations = relations(places, ({ one, many }) => ({
	address: one(addresses, {
		fields: [places.addressId],
		references: [addresses.id],
	}),
	category: one(categories, {
		fields: [places.categoryId],
		references: [categories.id],
	}),
	assets: many(assets),
}));

export const eventAgeRestriction = pgEnum('event_age_restriction', [
	'4+',
	'9+',
	'13+',
	'16+',
	'18+',
	'unrated',
]);

export const eventRefundPolicy = pgEnum('event_refund_policy', [
	'full-refund',
	'partial-refund',
	'no-refund',
	'conditional',
	'unspecified',
]);

export const eventRecurrenceFrequency = pgEnum('event_recurrence_frequency', [
	'no-recurrence',
	'daily',
	'weekly',
	'monthly',
	'annually',
	'seasonal',
	'unspecified',
]);

export const events = pgTable(
	'events',
	{
		id: text().primaryKey(),
		title: text().notNull(),
		startsAt: timestamp({ withTimezone: true }).notNull(),
		endsAt: timestamp({ withTimezone: true }).notNull(),
		addressId: integer()
			.notNull()
			.references(() => addresses.id, { onDelete: 'cascade' }),
		description: text().notNull(),
		organizerId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		externalUrl: text(),
		ageRestriction: eventAgeRestriction().notNull().default('unrated'),
		amenities: jsonb().notNull().default('[]').$type<string[]>(),
		refundPolicy: eventRefundPolicy().notNull().default('unspecified'),
		faq: jsonb().notNull().default('{}').$type<Record<string, string>>(),
		placeId: text().references(() => places.id, { onDelete: 'set null' }),
		isOnline: boolean().notNull().default(false),
		recurrence: eventRecurrenceFrequency().notNull().default('unspecified'),
		categories: jsonb().notNull().default('[]').$type<string[]>(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		index().on(table.addressId),
		index().on(table.organizerId),
		index().on(table.createdAt),
		index().on(table.title),
	],
);

export const eventsRelations = relations(events, ({ one, many }) => ({
	address: one(addresses, {
		fields: [events.addressId],
		references: [addresses.id],
	}),
	organizer: one(users, {
		fields: [events.organizerId],
		references: [users.id],
	}),
	assets: many(assets),
	ticketOptions: many(eventTicketOptions),
	agenda: many(eventAgendaItems),
	lineup: many(eventLineupItems),
}));

export const eventTicketOptions = pgTable(
	'event_ticket_options',
	{
		id: text().primaryKey(),
		eventId: text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		name: text().notNull(),
		description: text().notNull(),
		fee: integer().notNull(),
		currency: text().notNull(),
		totalAvailability: integer().notNull(),
		currentAvailability: integer().notNull(),
		externalUrl: text(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.eventId)],
);

export const eventTicketOptionsRelations = relations(
	eventTicketOptions,
	({ one }) => ({
		event: one(events, {
			fields: [eventTicketOptions.eventId],
			references: [events.id],
		}),
	}),
);

export const eventAgendaItems = pgTable(
	'event_agenda_items',
	{
		id: text().primaryKey(),
		eventId: text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		startsAt: timestamp({ withTimezone: true }).notNull(),
		endsAt: timestamp({ withTimezone: true }).notNull(),
		title: text().notNull(),
		description: text(),
	},
	(table) => [index().on(table.eventId)],
);

export const eventAgendaItemsRelations = relations(
	eventAgendaItems,
	({ one }) => ({
		event: one(events, {
			fields: [eventAgendaItems.eventId],
			references: [events.id],
		}),
	}),
);

export const eventLineupItems = pgTable(
	'event_lineup_items',
	{
		id: text().primaryKey(),
		eventId: text()
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		name: text().notNull(),
		userId: text().references(() => users.id, { onDelete: 'set null' }),
		badge: text().notNull(),
		title: text(),
		description: text(),
		order: integer().notNull(),
	},
	(table) => [
		index().on(table.eventId),
		index().on(table.order),
		index().on(table.userId),
	],
);

export const eventLineupItemsRelations = relations(
	eventLineupItems,
	({ one }) => ({
		event: one(events, {
			fields: [eventLineupItems.eventId],
			references: [events.id],
		}),
		user: one(users, {
			fields: [eventLineupItems.userId],
			references: [users.id],
		}),
	}),
);

export const bookmarks = pgTable(
	'bookmarks',
	{
		id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.placeId)],
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	place: one(places, {
		fields: [bookmarks.placeId],
		references: [places.id],
	}),
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id],
	}),
}));

export const favorites = pgTable(
	'favorites',
	{
		id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.placeId)],
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
	place: one(places, {
		fields: [favorites.placeId],
		references: [places.id],
	}),
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id],
	}),
}));

export const collections = pgTable('collections', {
	id: text().primaryKey(),
	name: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	items: many(collectionItems),
}));

export const collectionItems = pgTable(
	'collection_items',
	{
		collectionId: text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.collectionId, table.placeId] }),
		unique().on(table.collectionId, table.index),
	],
);

export const collectionItemsRelations = relations(
	collectionItems,
	({ one }) => ({
		collection: one(collections, {
			fields: [collectionItems.collectionId],
			references: [collections.id],
		}),
		place: one(places, {
			fields: [collectionItems.placeId],
			references: [places.id],
		}),
	}),
);

export const collectionsPlaces = pgTable(
	'collections_places',
	{
		collectionId: text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.collectionId, table.placeId] }),
		unique().on(table.collectionId, table.index),
	],
);

export const collectionsPlacesRelations = relations(
	collectionsPlaces,
	({ one }) => ({
		collection: one(collections, {
			fields: [collectionsPlaces.collectionId],
			references: [collections.id],
		}),
		place: one(places, {
			fields: [collectionsPlaces.placeId],
			references: [places.id],
		}),
	}),
);

export const collectionsCities = pgTable(
	'collections_cities',
	{
		collectionId: text()
			.notNull()
			.references(() => collections.id, { onDelete: 'cascade' }),
		cityId: integer()
			.notNull()
			.references(() => cities.id, { onDelete: 'cascade' }),
		index: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.collectionId, table.cityId] }),
		unique().on(table.collectionId, table.index),
	],
);

export const collectionsCitiesRelations = relations(
	collectionsCities,
	({ one }) => ({
		collection: one(collections, {
			fields: [collectionsCities.collectionId],
			references: [collections.id],
		}),
		city: one(cities, {
			fields: [collectionsCities.cityId],
			references: [cities.id],
		}),
	}),
);

export const lists = pgTable(
	'lists',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		isPublic: boolean().notNull().default(false),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.userId)],
);

export const listsRelations = relations(lists, ({ many, one }) => ({
	items: many(listItems),
	user: one(users, {
		fields: [lists.userId],
		references: [users.id],
	}),
}));

export const listItems = pgTable(
	'list_items',
	{
		listId: text()
			.notNull()
			.references(() => lists.id, { onDelete: 'cascade' }),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.listId, table.placeId] }),
		unique().on(table.listId, table.index),
	],
);

export const listItemsRelations = relations(listItems, ({ one }) => ({
	list: one(lists, {
		fields: [listItems.listId],
		references: [lists.id],
	}),
	place: one(places, {
		fields: [listItems.placeId],
		references: [places.id],
	}),
}));

export const reviews = pgTable(
	'reviews',
	{
		id: text().primaryKey(),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		content: text().notNull(),
		rating: smallint().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.placeId), index().on(table.userId)],
);

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
	place: one(places, {
		fields: [reviews.placeId],
		references: [places.id],
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id],
	}),
	assets: many(assets),
}));

export const tripVisibilityLevel = pgEnum('trip_visibility_level', [
	'private',
	'friends',
	'public',
]);

export const trips = pgTable('trips', {
	id: text().primaryKey(),
	ownerId: text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	description: text().notNull().default(''),
	visibilityLevel: tripVisibilityLevel().notNull().default('private'),
	requestedAmenities: jsonb().notNull().default('[]').$type<string[]>(),
	startAt: timestamp({ withTimezone: true }).notNull(),
	endAt: timestamp({ withTimezone: true }).notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const tripsRelations = relations(trips, ({ many, one }) => ({
	participants: many(tripParticipants),
	invites: many(tripInvites),
	locations: many(tripLocations),
	comments: many(tripComments),
	owner: one(users, {
		fields: [trips.ownerId],
		references: [users.id],
	}),
}));

export const tripRole = pgEnum('trip_role', ['member', 'editor']);

export const tripInvites = pgTable(
	'trip_invites',
	{
		id: text().primaryKey(),
		tripId: text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		fromId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		toId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		sentAt: timestamp({ withTimezone: true }).notNull(),
		expiresAt: timestamp({ withTimezone: true }).notNull(),
		tripTitle: text().notNull(),
		role: tripRole().notNull(),
	},
	(table) => [
		unique().on(table.tripId, table.toId),
		index().on(table.toId),
		index().on(table.fromId),
		index().on(table.tripId),
	],
);

export const tripInvitesRelations = relations(tripInvites, ({ one }) => ({
	trip: one(trips, {
		fields: [tripInvites.tripId],
		references: [trips.id],
	}),
	fromUser: one(users, {
		fields: [tripInvites.fromId],
		references: [users.id],
	}),
	toUser: one(users, {
		fields: [tripInvites.toId],
		references: [users.id],
	}),
}));

export const tripComments = pgTable(
	'trip_comments',
	{
		id: text().primaryKey(),
		tripId: text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		content: text().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index().on(table.tripId), index().on(table.userId)],
);

export const tripCommentsRelations = relations(tripComments, ({ one }) => ({
	trip: one(trips, {
		fields: [tripComments.tripId],
		references: [trips.id],
	}),
	user: one(users, {
		fields: [tripComments.userId],
		references: [users.id],
	}),
}));

export const tripLocations = pgTable(
	'trip_locations',
	{
		id: text().primaryKey(),
		tripId: text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		scheduledTime: timestamp({ withTimezone: true }).notNull(),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		description: text().notNull(),
	},
	(table) => [
		unique().on(table.tripId, table.placeId, table.scheduledTime),
		index().on(table.tripId),
		index().on(table.placeId),
	],
);

export const tripLocationsRelations = relations(tripLocations, ({ one }) => ({
	trip: one(trips, {
		fields: [tripLocations.tripId],
		references: [trips.id],
	}),
	place: one(places, {
		fields: [tripLocations.placeId],
		references: [places.id],
	}),
}));

export const tripParticipants = pgTable(
	'trip_participants',
	{
		id: text().primaryKey(),
		tripId: text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: tripRole().notNull(),
	},
	(table) => [unique().on(table.tripId, table.userId)],
);

export const tripParticipantsRelations = relations(
	tripParticipants,
	({ one }) => ({
		trip: one(trips, {
			fields: [tripParticipants.tripId],
			references: [trips.id],
		}),
		user: one(users, {
			fields: [tripParticipants.userId],
			references: [users.id],
		}),
	}),
);

export const reports = pgTable(
	'reports',
	{
		id: text().primaryKey(),
		resourceId: text().notNull(),
		resourceType: text().notNull(),
		reporterId: text()
			.notNull()
			.references(() => users.id),
		reason: integer().notNull(),
		description: text(),
		resolved: boolean().notNull().default(false),
		resolvedAt: timestamp({ withTimezone: true }),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		index().on(table.reporterId),
		index().on(table.resolved),
		index().on(table.resolvedAt),
		index().on(table.createdAt),
		index().on(table.updatedAt),
	],
);

export const userTopPlaces = pgTable(
	'user_top_places',
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		placeId: text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		index: integer().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.placeId] }),
		unique().on(table.userId, table.placeId, table.index),
	],
);

export const userTopPlacesRelations = relations(userTopPlaces, ({ one }) => ({
	user: one(users, {
		fields: [userTopPlaces.userId],
		references: [users.id],
	}),
	place: one(places, {
		fields: [userTopPlaces.placeId],
		references: [places.id],
	}),
}));
