import { $dto, $extended, Filter, Pagination, Sort } from '@wanderlust/common';
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

export const listInput = Pagination.queryParamsSchema.extend({
	sort: Sort.createSortSchema(['name', 'createdAt']).optional(),
	filter: Filter.createFilterSchema(
		['id', 'name', 'description', 'createdAt'],
		['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike'],
	).optional(),
});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	collections: collection.array(),
	pagination: Pagination.schema,
	sort: Sort.schema.optional(),
	filter: Filter.schema.optional(),
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

export const itemsAppendInput = collection
	.pick({
		id: true,
	})
	.extend($dto.collectionItem.pick({ placeId: true }).shape);

export type ItemsAppendInput = z.infer<typeof itemsAppendInput>;

export const itemsAppendOutput = z.object({
	collectionItem: collectionItem,
});

export type ItemsAppendOutput = z.infer<typeof itemsAppendOutput>;

export const itemsRemoveInput = collection
	.pick({
		id: true,
	})
	.extend($dto.collectionItem.pick({ placeId: true }).shape);

export type ItemsRemoveInput = z.infer<typeof itemsRemoveInput>;

export const itemsRemoveOutput = z.object({});

export type ItemsRemoveOutput = z.infer<typeof itemsRemoveOutput>;

export const itemsReorderInput = collection
	.pick({
		id: true,
	})
	.extend({
		placeIds: $dto.place.pick({ id: true }).shape.id.array(),
	});

export type ItemsReorderInput = z.infer<typeof itemsReorderInput>;

export const itemsReorderOutput = z.object({
	collection: collectionWithItems,
});

export type ItemsReorderOutput = z.infer<typeof itemsReorderOutput>;

export const placesListInput = z.object({
	placeId: z.string(),
});

export type PlacesListInput = z.infer<typeof placesListInput>;

export const placesListOutput = z.object({
	collections: collectionWithItems.array(),
});

export type PlacesListOutput = z.infer<typeof placesListOutput>;

export const placesAppendInput = z.object({
	placeId: z.string(),
	collectionId: z.string(),
});

export type PlacesAppendInput = z.infer<typeof placesAppendInput>;

export const placesAppendOutput = z.object({
	collection: collection,
});

export type PlacesAppendOutput = z.infer<typeof placesAppendOutput>;

export const placesReorderInput = z.object({
	placeId: z.string(),
	collectionIds: z.string().array(),
});

export type PlacesReorderInput = z.infer<typeof placesReorderInput>;

export const placesReorderOutput = z.object({
	collections: collection.array(),
});

export type PlacesReorderOutput = z.infer<typeof placesReorderOutput>;

export const placesRemoveInput = z.object({
	placeId: z.string(),
	collectionId: z.string(),
});

export type PlacesRemoveInput = z.infer<typeof placesRemoveInput>;

export const placesRemoveOutput = z.object({});

export type PlacesRemoveOutput = z.infer<typeof placesRemoveOutput>;

export const citiesListInput = z.object({
	cityId: z.string().min(1),
});

export type CitiesListInput = z.infer<typeof citiesListInput>;

export const citiesListOutput = z.object({
	collections: collectionWithItems.array(),
});

export type CitiesListOutput = z.infer<typeof citiesListOutput>;

export const citiesAppendInput = z.object({
	cityId: z.string().min(1),
	collectionId: z.string(),
});

export type CitiesAppendInput = z.infer<typeof citiesAppendInput>;

export const citiesAppendOutput = z.object({
	collection: collection,
});

export type CitiesAppendOutput = z.infer<typeof citiesAppendOutput>;

export const citiesReorderInput = z.object({
	cityId: z.string().min(1),
	collectionIds: z.string().array(),
});

export type CitiesReorderInput = z.infer<typeof citiesReorderInput>;

export const citiesReorderOutput = z.object({
	collections: collection.array(),
});

export type CitiesReorderOutput = z.infer<typeof citiesReorderOutput>;

export const citiesRemoveInput = z.object({
	cityId: z.string().min(1),
	collectionId: z.string(),
});

export type CitiesRemoveInput = z.infer<typeof citiesRemoveInput>;

export const citiesRemoveOutput = z.object({});

export type CitiesRemoveOutput = z.infer<typeof citiesRemoveOutput>;

export const relationsPlacesInput = collection.pick({
	id: true,
});

export type RelationsPlacesInput = z.infer<typeof relationsPlacesInput>;

export const relationsPlacesOutput = z.object({
	places: $extended.place.array(),
});

export type RelationsPlacesOutput = z.infer<typeof relationsPlacesOutput>;

export const relationsCitiesInput = collection.pick({
	id: true,
});

export type RelationsCitiesInput = z.infer<typeof relationsCitiesInput>;

export const relationsCitiesOutput = z.object({
	cities: $dto.city.array(),
});

export type RelationsCitiesOutput = z.infer<typeof relationsCitiesOutput>;
