import * as p from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import { reviewFacets } from '../custom-types';
import { users } from './auth';
import { places } from './places';

export const reviews = p.pgTable(
	'reviews',
	{
		id: p.text().primaryKey(),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		content: p.text().notNull(),
		facets: reviewFacets('facets').notNull().default([]),
		rating: p.smallint().notNull(),
		totalLikes: p.bigint({ mode: 'number' }).notNull().default(0),
		detectedLanguage: p.text(),
		visitedAt: p.timestamp({ withTimezone: true }).notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.placeId),
		p.index().on(table.userId),
		p.index().on(table.placeId, table.rating), // for rating range + filtering
		p.index().on(table.placeId, table.createdAt), // default sort
		p.index().on(table.placeId, table.totalLikes), // likes sort
		p.check('rating_range', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
		p.check('visited_at_past', sql`${table.visitedAt} <= now()`),
	],
);

export const reviewLikes = p.pgTable(
	'review_likes',
	{
		reviewId: p
			.text()
			.notNull()
			.references(() => reviews.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		p.primaryKey({ columns: [table.reviewId, table.userId] }),
		p.index().on(table.reviewId),
	],
);
