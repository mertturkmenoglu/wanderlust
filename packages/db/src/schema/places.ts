import * as p from 'drizzle-orm/pg-core';
import { addresses } from './addresses';
import { categories } from './categories';

export const places = p.pgTable(
	'places',
	{
		id: p.text().primaryKey(),
		name: p.text().notNull(),
		description: p.text().notNull(),
		phone: p.text(),
		website: p.text(),
		addressId: p
			.integer()
			.notNull()
			.references(() => addresses.id, { onDelete: 'cascade' }),
		categoryId: p
			.smallint()
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		priceLevel: p.smallint().notNull(),
		accessibilityLevel: p.smallint().notNull(),
		totalVotes: p.integer().notNull().default(0),
		totalPoints: p.integer().notNull().default(0),
		totalFavorites: p.integer().notNull().default(0),
		hours: p.jsonb().notNull().default('{}').$type<Record<string, string>>(),
		amenities: p.jsonb().notNull().default('[]').$type<string[]>(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.addressId),
		p.index().on(table.categoryId),
		p.index().on(table.createdAt),
		p.index().on(table.name),
	],
);
