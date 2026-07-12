import * as p from 'drizzle-orm/pg-core';

export const categories = p.pgTable('categories', {
	id: p.smallint().primaryKey(),
	name: p.text().notNull().unique(),
	image: p.text().notNull(),
});
