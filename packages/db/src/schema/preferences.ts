import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';

export const preferenceUnitsEnum = p.pgEnum('preference_units', [
	'metric',
	'imperial',
]);

export const preferenceMapStyleEnum = p.pgEnum('preference_map_style', [
	'auto',
	'light',
	'dark',
]);

export const preferenceSearchRadiusEnum = p.pgEnum('preference_search_radius', [
	'close',
	'medium',
	'far',
]);

export const preferenceThemeEnum = p.pgEnum('preference_theme', [
	'system',
	'light',
	'dark',
]);

export const preferences = p.pgTable('preferences', {
	userId: p
		.text()
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	units: preferenceUnitsEnum().notNull().default('metric'),
	timezone: p.varchar({ length: 64 }).notNull().default('Etc/UTC'), // There are long IANA timezone names, so we use varchar(64) to be safe
	mapStyle: preferenceMapStyleEnum().notNull().default('auto'),
	searchRadius: preferenceSearchRadiusEnum().notNull().default('close'),
	enableSearchHistory: p.boolean().notNull().default(true),
	enableRecentViews: p.boolean().notNull().default(true),
	theme: preferenceThemeEnum().notNull().default('system'),
});
