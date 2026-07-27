import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';
import { places } from './places';

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

export const tripItineraryTransportationMode = p.pgEnum(
	'trip_itinerary_transportation_mode',
	['flight', 'car', 'train', 'bus', 'boat', 'other'],
);

export const tripItineraryItemType = p.pgEnum('trip_itinerary_item_type', [
	'accommodation',
	'transportation',
	'event',
	'location',
	'dining',
	'other',
]);

export const itineraryItems = p.pgTable(
	'itinerary_items',
	{
		id: p
			.text()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		tripId: p
			.text()
			.notNull()
			.references(() => trips.id, { onDelete: 'cascade' }),
		scheduledTime: p.timestamp({ withTimezone: true }).notNull(),
		type: tripItineraryItemType().notNull(),
		booked: p.boolean(),
		checkInTime: p.timestamp({ withTimezone: true }),
		checkOutTime: p.timestamp({ withTimezone: true }),
		reservationNumber: p.text(),
		notes: p.text(),
		transportationMode: tripItineraryTransportationMode(),
		transportationName: p.text(),
		departureLocation: p.text(),
		departureTime: p.timestamp({ withTimezone: true }),
		arrivalLocation: p.text(),
		arrivalTime: p.timestamp({ withTimezone: true }),
		transportationConfirmationNumber: p.text(),
		title: p.text(),
		placeId: p.text().references(() => places.id, { onDelete: 'set null' }),
	},
	(t) => [
		p.index().on(t.tripId),
		p.index().on(t.placeId),
		p.index().on(t.scheduledTime),
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
