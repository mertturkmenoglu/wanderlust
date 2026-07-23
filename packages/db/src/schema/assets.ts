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

		// The status of the asset, which can be one of the following:
		// - pending: record has been created, waiting file to be uploaded to the object storage
		// - ready: record has been created, file has been uploaded to the object storage, but not yet associated with a place or review
		// - available: record has been created, file has been uploaded to the object storage, and associated with a place or review
		// - failed: record has been created, but the file upload to the object storage has failed
		status: p
			.text('status', { enum: ['pending', 'ready', 'available', 'failed'] })
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
