import * as p from 'drizzle-orm/pg-core';
import { attributions } from '../custom-types';
import { users } from './auth';
import { places } from './places';
import { reviews } from './reviews';

export const assets = p.pgTable(
	'assets',
	{
		id: p.uuid().defaultRandom().primaryKey(),

		url: p.text().notNull(),
		bucket: p.text().notNull(),
		key: p.text().notNull(),

		mimeType: p.text().notNull(),
		size: p.integer().notNull(),

		width: p.integer(),
		height: p.integer(),
		blurhash: p.text(),
		alt: p.text(),

		status: p
			.text('status', { enum: ['pending', 'ready', 'failed'] })
			.notNull()
			.default('pending'),
		visibility: p
			.text('visibility', { enum: ['public', 'private'] })
			.notNull()
			.default('public'),

		uploadedBy: p.text().references(() => users.id, { onDelete: 'set null' }),
		metadata: p.jsonb().$type<Record<string, unknown>>(),
		attributions: attributions('attributions').notNull().default([]),

		createdAt: p.timestamp().notNull().defaultNow(),
		updatedAt: p
			.timestamp()
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
		deletedAt: p.timestamp(),
	},
	(table) => [p.index().on(table.uploadedBy)],
);

export const assetsToPlaces = p.pgTable(
	'assets_to_places',
	{
		assetId: p
			.uuid()
			.notNull()
			.references(() => assets.id),
		placeId: p
			.text()
			.notNull()
			.references(() => places.id),
		order: p.integer().notNull(),
	},
	(table) => [
		p.primaryKey(table.assetId, table.placeId),
		p.unique().on(table.placeId, table.order),
	],
);

export const assetsToReviews = p.pgTable(
	'assets_to_reviews',
	{
		assetId: p
			.uuid()
			.notNull()
			.references(() => assets.id),
		reviewId: p
			.text()
			.notNull()
			.references(() => reviews.id),
		order: p.integer().notNull(),
	},
	(table) => [
		p.primaryKey(table.assetId, table.reviewId),
		p.unique().on(table.reviewId, table.order),
	],
);
