import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';
import { openingHours } from '../custom-types';
import { categories } from './categories';

export const placeStatus = p.pgEnum('place_status', [
	'unknown', // Status is unknown
	'operational', // Operational (not necessarily open at the moment)
	'closed_temp', // Temporarily closed (e.g. for renovations)
	'closed_perm', // Permanently closed
	'future', // Not yet open (e.g. under construction)
]);

export const placePriceLevel = p.pgEnum('place_price_level', [
	'unknown', // Price level is unknown = -1
	'free', // Free = 0
	'cheap', // Cheap = 1
	'moderate', // Moderate = 2
	'expensive', // Expensive = 3
	'very_expensive', // Very expensive = 4
]);

export const placeAccessibilityLevel = p.pgEnum('place_accessibility_level', [
	'unknown', // Accessibility level is unknown = -1
	'not_accessible', // Not accessible = 0
	'partially_accessible', // Partially accessible = 1
	'highly_accessible', // Highly accessible = 2
]);

export const places = p.pgTable(
	'places',
	{
		id: p.text().primaryKey(),
		name: p.text().notNull(),
		description: p.text().notNull(),
		status: placeStatus().notNull().default('unknown'),
		intlPhone: p.text(), // International phone number in E.164 format
		websites: p.jsonb().notNull().default('[]').$type<string[]>(), // Array of website URLs
		socials: p.jsonb().notNull().default('[]').$type<string[]>(), // Array of social media URLs
		primaryCategoryId: p
			.text()
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		secondaryCategoryIds: p.jsonb().notNull().default('[]').$type<string[]>(), // Array of category IDs
		priceLevel: placePriceLevel().notNull().default('unknown'),
		accessibilityLevel: placeAccessibilityLevel().notNull().default('unknown'),
		totalVotes: p.integer().notNull().default(0),
		totalPoints: p.integer().notNull().default(0),
		rating: p
			.doublePrecision()
			.notNull()
			.generatedAlwaysAs(
				sql`CASE WHEN "totalVotes" = 0 THEN 0 ELSE ROUND("totalPoints"::numeric / "totalVotes", 2)::double precision END`,
			),
		totalFavorites: p.integer().notNull().default(0),
		openingHours: openingHours('openingHours').notNull().default({
			regular: [],
			special: [],
		}),
		amenities: p.jsonb().notNull().default('[]').$type<string[]>(), // string[] of amenity IDs with .0 and .1 suffixes. (.0=Not supported, .1=Supported)
		paymentOptions: p.jsonb().notNull().default('[]').$type<string[]>(), // ['cash', 'cc', 'mobile'] with .0 and .1 suffixes. (.0=Not supported, .1=Supported)
		parkingOptions: p.jsonb().notNull().default('[]').$type<string[]>(), // ['free_street', 'paid_street', 'free_lot', 'paid_lot', 'valet', 'free_garage', 'paid_garage'] with .0 and .1 suffixes. (.0=Not supported, .1=Supported)
		accessibilityOptions: p.jsonb().notNull().default('[]').$type<string[]>(), // ['parking', 'entrance', 'restroom', 'seating'] with .0 and .1 suffixes. (.0=Not supported, .1=Supported)
		countryCode: p.char({ length: 2 }).notNull(), // ISO 3166-1 alpha-2 country code
		countryName: p.text().notNull(),
		adminAreaCode: p.text().notNull(), // ISO 3166-2 subdivision code (e.g. US-CA)
		adminAreaName: p.text().notNull(),
		locality: p.text().notNull(), // City or town name
		subLocality: p.text(), // Neighborhood or district name
		postalCode: p.text(), // Postal code
		addressLine: p.text().notNull(), // Full address line
		lat: p.doublePrecision().notNull(),
		lng: p.doublePrecision().notNull(),
		wlCityId: p.text().notNull(), // ID of the city in the Wanderlust database
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		p.index().on(table.primaryCategoryId),
		p.index().on(table.secondaryCategoryIds),
		p.index().on(table.wlCityId),
		p.index().on(table.createdAt),
		p.index().on(table.name),
	],
);
