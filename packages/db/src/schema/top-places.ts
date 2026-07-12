import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';
import { places } from './places';

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
