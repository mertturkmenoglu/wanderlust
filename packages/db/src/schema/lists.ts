import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';
import { places } from './places';

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
