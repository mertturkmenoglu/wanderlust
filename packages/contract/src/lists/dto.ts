import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	const list = Types.List.extend({
		user: Types.Users.View.Basic,
	});

	const listWithItems = list.extend({
		items: Types.Lists.Item.extend({
			place: Types.Places.Extended,
			meta: Types.Places.Meta,
		}).array(),
	});

	export const listInput = Types.Pagination.queryParamsSchema.extend({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		lists: list.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const getInput = Types.List.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		list: listWithItems,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const listPlaceSaveStatInput = Types.Lists.Item.pick({
		placeId: true,
	});

	export type ListPlaceSaveStatInput = z.infer<typeof listPlaceSaveStatInput>;

	export const listPlaceSaveStatOutput = z.object({
		statuses: z
			.object({
				id: Types.Resources.id,
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

	export type ListPlaceSaveStatOutput = z.infer<typeof listPlaceSaveStatOutput>;

	export const listPublicInput = Types.Pagination.queryParamsSchema.extend(
		Types.User.pick({ username: true }).shape,
	);

	export type ListPublicInput = z.infer<typeof listPublicInput>;

	export const listPublicOutput = z.object({
		lists: list.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListPublicOutput = z.infer<typeof listPublicOutput>;

	export const createInput = Types.List.pick({
		name: true,
		isPublic: true,
	});

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		list: list,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const updateInput = Types.List.pick({
		id: true,
		name: true,
		isPublic: true,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		list: list,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const deleteInput = Types.List.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const itemsUpdateInput = z
		.object({
			id: Types.List.pick({ id: true }).shape.id,
		})
		.extend({
			update: z.xor([
				z.object({
					op: z.literal('add'),
					items: Types.Lists.Item.pick({ placeId: true }).shape.placeId.array(),
				}),
				z.object({
					op: z.literal('remove'),
					items: Types.Lists.Item.pick({ placeId: true }).shape.placeId.array(),
				}),
				z.object({
					op: z.literal('move'),
					items: Types.Lists.Item.pick({ placeId: true }).shape.placeId.array(),
				}),
			]),
		});

	export type ItemsUpdateInput = z.infer<typeof itemsUpdateInput>;

	export const itemsUpdateOutput = z.object({
		list: listWithItems,
	});

	export type ItemsUpdateOutput = z.infer<typeof itemsUpdateOutput>;
}
