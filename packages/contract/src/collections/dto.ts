import { $dto, $extended, Pagination } from '@wanderlust/common';
import z from 'zod';

const collection = $dto.collection;

const collectionItem = $dto.collectionItem.extend({
	place: $extended.place,
	meta: z.object({
		isFavorite: z.boolean(),
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

export const getInput = $dto.collection.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	collection: collectionWithItems,
});

export type GetOutput = z.infer<typeof getOutput>;

export const createInput = $dto.collection.pick({
	name: true,
	description: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	collection: collection,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.collection.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateInput = $dto.collection.pick({
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
	.extend($dto.collectionItem.pick({ placeId: true }).shape);

export type AppendItemInput = z.infer<typeof appendItemInput>;

export const appendItemOutput = z.object({
	collectionItem: collectionItem,
});

export type AppendItemOutput = z.infer<typeof appendItemOutput>;

export const removeItemInput = collection
	.pick({
		id: true,
	})
	.extend($dto.collectionItem.pick({ placeId: true }).shape);

export type RemoveItemInput = z.infer<typeof removeItemInput>;

export const removeItemOutput = z.object({});

export type RemoveItemOutput = z.infer<typeof removeItemOutput>;

export const reorderItemsInput = collection
	.pick({
		id: true,
	})
	.extend({
		placeIds: $dto.place.pick({ id: true }).shape.id.array(),
	});

export type ReorderItemsInput = z.infer<typeof reorderItemsInput>;

export const reorderItemsOutput = z.object({
	collection: collectionWithItems,
});

export type ReorderItemsOutput = z.infer<typeof reorderItemsOutput>;

export const getCollectionPlaceRelationInput = z.object({
	collectionId: z.string(),
	placeId: z.string(),
});

export type GetCollectionPlaceRelationInput = z.infer<
	typeof getCollectionPlaceRelationInput
>;

export const getCollectionPlaceRelationOutput = z.object({
	collection: collection,
	place: $extended.place,
});

export type GetCollectionPlaceRelationOutput = z.infer<
	typeof getCollectionPlaceRelationOutput
>;

export const listCollectionPlaceRelationsInput = z.object({
	collectionId: z.string(),
});

export type ListCollectionPlaceRelationsInput = z.infer<
	typeof listCollectionPlaceRelationsInput
>;

export const listCollectionPlaceRelationsOutput = z.object({
	places: $extended.place.array(),
});

export type ListCollectionPlaceRelationsOutput = z.infer<
	typeof listCollectionPlaceRelationsOutput
>;

export const createCollectionPlaceRelationInput = z.object({
	collectionId: z.string(),
	placeId: z.string(),
});

export type CreateCollectionPlaceRelationInput = z.infer<
	typeof createCollectionPlaceRelationInput
>;

export const createCollectionPlaceRelationOutput = z.object({
	collection: collection,
});

export type CreateCollectionPlaceRelationOutput = z.infer<
	typeof createCollectionPlaceRelationOutput
>;

export const deleteCollectionPlaceRelationInput = z.object({
	collectionId: z.string(),
	placeId: z.string(),
});

export type DeleteCollectionPlaceRelationInput = z.infer<
	typeof deleteCollectionPlaceRelationInput
>;

export const deleteCollectionPlaceRelationOutput = z.object({});

export type DeleteCollectionPlaceRelationOutput = z.infer<
	typeof deleteCollectionPlaceRelationOutput
>;

export const getCollectionCityRelationInput = z.object({
	collectionId: z.string(),
	cityId: z.int(),
});

export type GetCollectionCityRelationInput = z.infer<
	typeof getCollectionCityRelationInput
>;

export const getCollectionCityRelationOutput = z.object({
	collection: collection,
	city: $dto.city,
});

export type GetCollectionCityRelationOutput = z.infer<
	typeof getCollectionCityRelationOutput
>;

export const listCollectionCityRelationsInput = z.object({
	collectionId: z.string(),
});

export type ListCollectionCityRelationsInput = z.infer<
	typeof listCollectionCityRelationsInput
>;

export const listCollectionCityRelationsOutput = z.object({
	cities: $dto.city.array(),
});

export type ListCollectionCityRelationsOutput = z.infer<
	typeof listCollectionCityRelationsOutput
>;

export const createCollectionCityRelationInput = z.object({
	collectionId: z.string(),
	cityId: z.int(),
});

export type CreateCollectionCityRelationInput = z.infer<
	typeof createCollectionCityRelationInput
>;

export const createCollectionCityRelationOutput = z.object({
	collection: collection,
});

export type CreateCollectionCityRelationOutput = z.infer<
	typeof createCollectionCityRelationOutput
>;

export const deleteCollectionCityRelationInput = z.object({
	collectionId: z.string(),
	cityId: z.int(),
});

export type DeleteCollectionCityRelationInput = z.infer<
	typeof deleteCollectionCityRelationInput
>;

export const deleteCollectionCityRelationOutput = z.object({});

export type DeleteCollectionCityRelationOutput = z.infer<
	typeof deleteCollectionCityRelationOutput
>;

export const listByPlaceInput = $dto.place.pick({
	id: true,
});

export type ListByPlaceInput = z.infer<typeof listByPlaceInput>;

export const listByPlaceOutput = z.object({
	collections: collectionWithItems.array(),
});

export type ListByPlaceOutput = z.infer<typeof listByPlaceOutput>;

export const listByCityInput = $dto.city.pick({
	id: true,
});

export type ListByCityInput = z.infer<typeof listByCityInput>;

export const listByCityOutput = z.object({
	collections: collectionWithItems.array(),
});

export type ListByCityOutput = z.infer<typeof listByCityOutput>;
