import * as p from 'drizzle-orm/pg-core';
import { attributions } from '../custom-types';

export const cities = p.pgTable('cities', {
	id: p.text().primaryKey(),
	name: p.text().notNull(),
	stateCode: p.text().notNull(),
	stateName: p.text().notNull(),
	countryCode: p.text().notNull(),
	countryName: p.text().notNull(),
	image: p.text().notNull(),
	lat: p.doublePrecision().notNull(),
	lng: p.doublePrecision().notNull(),
	description: p.text().notNull(),
	timezone: p.text().notNull(),
	attributions: attributions('attributions').notNull().default([]),
});
