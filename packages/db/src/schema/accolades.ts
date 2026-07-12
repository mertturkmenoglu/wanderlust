import * as p from 'drizzle-orm/pg-core';
import { places } from './places';

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
