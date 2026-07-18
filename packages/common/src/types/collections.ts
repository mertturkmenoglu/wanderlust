import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Places } from './places';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const Collection = createSelectSchema(schema.collections, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Name of the collection',
			examples: ['My Favorite Places'],
		}),
	description: z
		.string()
		.min(1)
		.meta({
			description: 'Description of the collection',
			examples: ['A curated list of my favorite places to visit.'],
		}),
	createdAt: Timestamp,
}).meta({
	description: 'A collection entity',
});

export namespace Collections {
	export const Item = createSelectSchema(schema.collectionItems, {
		collectionId: Resources.id,
		placeId: Resources.id,
		index: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Index of the item within the collection',
				examples: [0],
			}),
		createdAt: Timestamp,
	}).meta({
		description: 'A collection item entity',
	});

	export const ExtendedItem = Item.extend({
		place: Places.Extended,
		meta: Places.Meta,
	}).meta({
		description: 'A collection item entity with extended information',
	});

	export const Extended = Collection.extend({
		items: z.array(ExtendedItem),
	}).meta({
		description: 'A collection entity with extended information',
	});

	export namespace $Insert {
		export const Collection = createInsertSchema(schema.collections).pick({
			id: true,
			name: true,
			description: true,
		});

		export type Collection = z.infer<typeof Collection>;

		export const Item = createInsertSchema(schema.collectionItems);

		export type Item = z.infer<typeof Item>;

		export const CityRelation = createInsertSchema(schema.collectionsCities);

		export type CityRelation = z.infer<typeof CityRelation>;

		export const PlaceRelation = createInsertSchema(schema.collectionsPlaces);

		export type PlaceRelation = z.infer<typeof PlaceRelation>;
	}
}
