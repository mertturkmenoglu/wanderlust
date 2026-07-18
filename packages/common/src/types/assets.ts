import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Url } from './url';

export const Asset = createSelectSchema(schema.assets, {
	id: z
		.number()
		.int()
		.meta({
			description: 'Asset ID',
			examples: [123456],
		}),
	entityType: z.enum(['place', 'review', 'event']).meta({
		description: 'Type of entity the asset is associated with',
		examples: ['place'],
	}),
	entityId: Resources.id,
	url: Url,
	description: z
		.string()
		.max(512)
		.nullable()
		.meta({
			description: 'Description of the asset',
			examples: ['A beautiful view of the city skyline.'],
		}),
	order: z
		.number()
		.int()
		.min(0)
		.max(64)
		.meta({
			description: 'Order of the asset among other assets for the same entity',
			examples: [0],
		}),
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'An asset entity',
});

export namespace Assets {
	export namespace $Insert {
		export const Asset = createInsertSchema(schema.assets);

		export type Asset = z.infer<typeof Asset>;
	}
}
