import z from 'zod';
import { $ } from '@/db/schema';
import { Pagination } from '@/lib/pagination';

const collection = $.collection;

const collectionItem = $.collectionItem.extend({
	place: $.place.extend({
		assets: $.asset.array(),
		category: $.category,
		address: $.address.extend({
			city: $.city,
		}),
	}),
});

const collectionWithItems = collection.extend({
	items: collectionItem.array(),
});

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	collections: collection.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const getInput = $.collection.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	collection: collectionWithItems,
});

export type GetOutput = z.infer<typeof getOutput>;

export const createInput = $.collection.pick({
	name: true,
	description: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	collection: collection,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $.collection.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateInput = $.collection.pick({
	id: true,
	name: true,
	description: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	collection: collection,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const appendItemInput = collection
	.pick({
		id: true,
	})
	.extend($.collectionItem.pick({ placeId: true }).shape);

export type AppendItemInput = z.infer<typeof appendItemInput>;

export const appendItemOutput = z.object({
	collectionItem: collectionItem,
});

export type AppendItemOutput = z.infer<typeof appendItemOutput>;

export const removeItemInput = collection
	.pick({
		id: true,
	})
	.extend($.collectionItem.pick({ placeId: true }).shape);

export type RemoveItemInput = z.infer<typeof removeItemInput>;

export const removeItemOutput = z.object({});

export type RemoveItemOutput = z.infer<typeof removeItemOutput>;

export const reorderItemsInput = collection
	.pick({
		id: true,
	})
	.extend({
		placeIds: $.place.pick({ id: true }).shape.id.array(),
	});

export type ReorderItemsInput = z.infer<typeof reorderItemsInput>;

export const reorderItemsOutput = z.object({
	collection: collectionWithItems,
});

export type ReorderItemsOutput = z.infer<typeof reorderItemsOutput>;

export const createPlaceRelationInput = $.collection
	.pick({
		id: true,
	})
	.extend($.collectionItem.pick({ placeId: true }).shape);

export type CreatePlaceRelationInput = z.infer<typeof createPlaceRelationInput>;

export const createPlaceRelationOutput = z.object({});

export type CreatePlaceRelationOutput = z.infer<
	typeof createPlaceRelationOutput
>;

export const deletePlaceRelationInput = $.collection
	.pick({
		id: true,
	})
	.extend($.collectionItem.pick({ placeId: true }).shape);

export type DeletePlaceRelationInput = z.infer<typeof deletePlaceRelationInput>;

export const deletePlaceRelationOutput = z.object({});

export type DeletePlaceRelationOutput = z.infer<
	typeof deletePlaceRelationOutput
>;

export const createCityRelationInput = $.collection
	.pick({
		id: true,
	})
	.extend(
		z.object({
			cityId: z
				.number()
				.int()
				.min(1)
				.meta({
					description: 'The ID of the city to relate to the collection',
					examples: [1024],
				}),
		}).shape,
	);

export type CreateCityRelationInput = z.infer<typeof createCityRelationInput>;

export const createCityRelationOutput = z.object({});

export type CreateCityRelationOutput = z.infer<typeof createCityRelationOutput>;

export const deleteCityRelationInput = $.collection
	.pick({
		id: true,
	})
	.extend(
		z.object({
			cityId: z
				.number()
				.int()
				.min(1)
				.meta({
					description: 'The ID of the city to remove from the collection',
					examples: [1024],
				}),
		}).shape,
	);

export type DeleteCityRelationInput = z.infer<typeof deleteCityRelationInput>;

export const deleteCityRelationOutput = z.object({});

export type DeleteCityRelationOutput = z.infer<typeof deleteCityRelationOutput>;

export const listByPlaceIdInput = $.collectionItem.pick({
	placeId: true,
});

export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

export const listByPlaceIdOutput = z.object({
	collections: collectionWithItems.array(),
});

export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

export const listByCityIdInput = z.object({
	cityId: z
		.number()
		.int()
		.min(1)
		.meta({
			description: 'The ID of the city to get collections for',
			examples: [1024],
		}),
});

export type ListByCityIdInput = z.infer<typeof listByCityIdInput>;

export const listByCityIdOutput = z.object({
	collections: collectionWithItems.array(),
});

export type ListByCityIdOutput = z.infer<typeof listByCityIdOutput>;

export const listAllPlaceCollectionsInput = Pagination.queryParamsSchema.extend(
	{},
);

export type ListAllPlaceCollectionsInput = z.infer<
	typeof listAllPlaceCollectionsInput
>;

export const ListAllPlaceCollectionsOutput = z.object({
	relations: z
		.object({
			createdAt: z.date(),
			placeId: z.string(),
			collectionId: z.string(),
			index: z.number().int(),
			collection: z.object({
				id: z.string(),
				name: z.string(),
				createdAt: z.date(),
				description: z.string(),
			}),
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListAllPlaceCollectionsOutput = z.infer<
	typeof ListAllPlaceCollectionsOutput
>;

export const ListAllCityCollectionsInput = Pagination.queryParamsSchema.extend(
	{},
);

export type ListAllCityCollectionsInput = z.infer<
	typeof ListAllCityCollectionsInput
>;

export const ListAllCityCollectionsOutput = z.object({
	collections: collection.array(),
	pagination: Pagination.schema,
});

export type ListAllCityCollectionsOutput = z.infer<
	typeof ListAllCityCollectionsOutput
>;
