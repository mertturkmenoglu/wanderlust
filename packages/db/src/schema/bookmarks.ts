import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';
import { places } from './places';

export const bookmarks = p.pgTable(
	'bookmarks',
	{
		id: p
			.text()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
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
