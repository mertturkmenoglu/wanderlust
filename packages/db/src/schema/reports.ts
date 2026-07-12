import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';

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
