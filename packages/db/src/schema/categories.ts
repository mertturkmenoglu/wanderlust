import * as p from 'drizzle-orm/pg-core';
import { attributions } from '../custom-types';

export const categories = p.pgTable('categories', {
	id: p.text().primaryKey(),
	name: p.text().notNull(),
	displayName: p.text().notNull(),
	description: p.text().notNull(),
	image: p.text().notNull(),
	attributions: attributions('attributions').notNull().default([]),
});
