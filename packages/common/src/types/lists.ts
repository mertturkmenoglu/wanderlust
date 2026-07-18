import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const List = createSelectSchema(schema.lists, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Name of the list',
			examples: ['London Attractions'],
		}),
	userId: Resources.id,
	isPublic: z.boolean().meta({
		description: 'Whether the list is public',
		examples: [true],
	}),
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'A list entity',
});

export namespace Lists {
	export const Item = createSelectSchema(schema.listItems, {
		listId: Resources.id,
		placeId: Resources.id,
		index: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Index of the item within the list',
				examples: [0],
			}),
		createdAt: Timestamp,
	}).meta({
		description: 'A list item entity',
	});

	export namespace $Insert {
		export const List = createInsertSchema(schema.lists);

		export type List = z.infer<typeof List>;

		export const Item = createInsertSchema(schema.listItems);

		export type Item = z.infer<typeof Item>;
	}
}
