import * as p from 'drizzle-orm/pg-core';

export const assetEntityType = p.pgEnum('asset_entity_type', [
	'place',
	'review',
	'event',
]);

export const assets = p.pgTable(
	'assets',
	{
		id: p.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
		entityType: assetEntityType().notNull(),
		entityId: p.text().notNull(),
		url: p.text().notNull(),
		description: p.text(),
		order: p.integer().notNull().default(0),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [p.index().on(table.entityType), p.index().on(table.entityId)],
);
