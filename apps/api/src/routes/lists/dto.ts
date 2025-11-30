import z from 'zod';
import { $ } from '@/db/schema';
import { Pagination } from '@/lib/pagination';

const list = $.list.extend({
	user: $.user.pick({
		id: true,
		username: true,
		name: true,
		image: true,
	}),
});

const listWithItems = list.extend({
	items: $.listItem
		.extend({
			place: $.place.extend({
				address: $.address.extend({
					city: $.city,
				}),
				category: $.category,
				assets: $.asset.array(),
			}),
		})
		.array(),
});

export const listAllInput = Pagination.queryParamsSchema.extend({});

export type ListAllInput = z.infer<typeof listAllInput>;

export const listAllOutput = z.object({
	lists: list.array(),
	pagination: Pagination.schema,
});

export type ListAllOutput = z.infer<typeof listAllOutput>;

export const getInput = $.list.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	list: listWithItems,
});

export type GetOutput = z.infer<typeof getOutput>;

export const checkStatusInput = $.listItem.pick({ placeId: true });

export type CheckStatusInput = z.infer<typeof checkStatusInput>;

export const checkStatusOutput = z.object({
	statuses: z
		.object({
			id: z.string().meta({ description: 'List ID', example: 'foo-bar' }),
			name: z
				.string()
				.meta({ description: 'List name', example: 'My Favorite Places' }),
			includes: z.boolean().meta({
				description: 'Whether the place is included in the list',
				example: true,
			}),
		})
		.meta({
			description: 'List inclusion status',
		})
		.array(),
});

export type CheckStatusOutput = z.infer<typeof checkStatusOutput>;

export const listPublicInput = Pagination.queryParamsSchema.extend(
	$.user.pick({ username: true }).shape,
);

export type ListPublicInput = z.infer<typeof listPublicInput>;

export const listPublicOutput = z.object({
	lists: list.array(),
	pagination: Pagination.schema,
});

export type ListPublicOutput = z.infer<typeof listPublicOutput>;

export const createInput = $.list.pick({
	name: true,
	isPublic: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	list: list,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = $.list.pick({
	id: true,
	name: true,
	isPublic: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	list: list,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $.list.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const appendItemInput = $.list
	.pick({ id: true })
	.extend($.listItem.pick({ placeId: true }).shape);

export type AppendItemInput = z.infer<typeof appendItemInput>;

export const appendItemOutput = z.object({
	item: $.listItem,
});

export type AppendItemOutput = z.infer<typeof appendItemOutput>;

export const updateItemsInput = $.list.pick({ id: true }).extend({
	placeIds: $.place.pick({ id: true }).shape.id.array(),
});

export type UpdateItemsInput = z.infer<typeof updateItemsInput>;

export const updateItemsOutput = z.object({
	list: list,
});

export type UpdateItemsOutput = z.infer<typeof updateItemsOutput>;

export const removeItemInput = $.list
	.pick({
		id: true,
	})
	.extend({
		placeId: $.place.pick({ id: true }).shape.id,
	});

export type RemoveItemInput = z.infer<typeof removeItemInput>;

export const removeItemOutput = z.object({});

export type RemoveItemOutput = z.infer<typeof removeItemOutput>;
