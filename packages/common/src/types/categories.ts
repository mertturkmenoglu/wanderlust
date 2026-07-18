import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Attribution } from './attributions';
import { Resources } from './resources';
import { Url } from './url';

export const Category = createSelectSchema(schema.categories, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(64)
		.meta({
			description: 'Name of the category',
			examples: ['nature.park'],
		}),
	displayName: z
		.string()
		.min(1)
		.max(64)
		.meta({
			description: 'Display name of the category',
			examples: ['Parks'],
		}),
	image: Url,
	attributions: Attribution.array(),
	description: z
		.string()
		.min(1)
		.max(512)
		.meta({
			description: 'Description of the category',
			examples: ['A category for parks and natural areas.'],
		}),
}).meta({
	description: 'A category entity',
});

export namespace Categories {
	export namespace $Insert {
		export const Category = createInsertSchema(schema.categories, {
			id: Resources.id,
			attributions: Attribution.array().max(10),
			description: z.string().min(1).max(512),
			displayName: z.string().min(1).max(64),
			image: Url,
			name: z.string().min(1).max(64),
		});

		export type Category = z.infer<typeof Category>;
	}
}
