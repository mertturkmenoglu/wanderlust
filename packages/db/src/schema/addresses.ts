import * as p from 'drizzle-orm/pg-core';
import { cities } from './cities';

export const addresses = p.pgTable('addresses', {
	id: p.integer().generatedAlwaysAsIdentity().primaryKey(),
	cityId: p
		.integer()
		.notNull()
		.references(() => cities.id, { onDelete: 'cascade' }),
	line1: p.text().notNull(),
	line2: p.text(),
	postalCode: p.text(),
	lat: p.doublePrecision().notNull(),
	lng: p.doublePrecision().notNull(),
});
