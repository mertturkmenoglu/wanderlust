import * as p from 'drizzle-orm/pg-core';
import { cities } from './cities';
import { places } from './places';

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
		p.unique().on(table.placeId, table.index),
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
			.text()
			.notNull()
			.references(() => cities.id, { onDelete: 'cascade' }),
		index: p.integer().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.collectionId, table.cityId] }),
		p.unique().on(table.cityId, table.index),
		p.index().on(table.cityId),
	],
);
