import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';
import { places } from './places';

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
