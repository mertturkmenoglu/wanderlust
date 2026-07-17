import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const listInput = Types.Pagination.queryParamsSchema.extend({
		sort: Types.Sort.createSortSchema(['name', 'createdAt']).optional(),
		filter: Types.Filter.createFilterSchema(
			['id', 'name', 'description', 'createdAt'],
			['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike'],
		).optional(),
	});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		collections: Types.Collection.array(),
		pagination: Types.Pagination.schema,
		sort: Types.Sort.schema.optional(),
		filter: Types.Filter.schema.optional(),
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const getInput = Types.Collection.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		collection: Types.Collections.Extended,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const createInput = Types.Collections.$Insert.Collection;

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		collection: Types.Collection,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const deleteInput = Types.Collection.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const updateInput = Types.Collections.$Insert.Collection.extend({
		id: Types.Resources.id,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		collection: Types.Collection,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const itemsUpdateInput = z
		.object({
			id: Types.Resources.id,
		})
		.extend({
			update: z.xor([
				z.object({
					op: z.literal('add'),
					items: Types.Collections.Item.pick({
						placeId: true,
					}).shape.placeId.array(),
				}),
				z.object({
					op: z.literal('remove'),
					items: Types.Collections.Item.pick({
						placeId: true,
					}).shape.placeId.array(),
				}),
				z.object({
					op: z.literal('move'),
					items: Types.Collections.Item.pick({
						placeId: true,
					}).shape.placeId.array(),
				}),
			]),
		});

	export type ItemsUpdateInput = z.infer<typeof itemsUpdateInput>;

	export const itemsUpdateOutput = z.object({
		collection: Types.Collections.Extended,
	});

	export type ItemsUpdateOutput = z.infer<typeof itemsUpdateOutput>;

	export const placesListInput = z.object({
		placeId: Types.Resources.id,
	});

	export type PlacesListInput = z.infer<typeof placesListInput>;

	export const placesListOutput = z.object({
		collections: Types.Collections.Extended.array(),
	});

	export type PlacesListOutput = z.infer<typeof placesListOutput>;

	export const placesUpdateInput = z
		.object({
			placeId: Types.Resources.id,
		})
		.extend({
			update: z.xor([
				z.object({
					op: z.literal('add'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
				z.object({
					op: z.literal('remove'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
				z.object({
					op: z.literal('move'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
			]),
		});

	export type PlacesUpdateInput = z.infer<typeof placesUpdateInput>;

	export const placesUpdateOutput = z.object({
		placeId: Types.Resources.id,
		collectionIds: Types.Resources.id.array(),
	});

	export type PlacesUpdateOutput = z.infer<typeof placesUpdateOutput>;

	export const citiesListInput = z.object({
		cityId: Types.Resources.id,
	});

	export type CitiesListInput = z.infer<typeof citiesListInput>;

	export const citiesListOutput = z.object({
		collections: Types.Collections.Extended.array(),
	});

	export type CitiesListOutput = z.infer<typeof citiesListOutput>;

	export const citiesUpdateInput = z
		.object({
			cityId: Types.Resources.id,
		})
		.extend({
			update: z.xor([
				z.object({
					op: z.literal('add'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
				z.object({
					op: z.literal('remove'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
				z.object({
					op: z.literal('move'),
					items: Types.Collection.pick({
						id: true,
					}).shape.id.array(),
				}),
			]),
		});

	export type CitiesUpdateInput = z.infer<typeof citiesUpdateInput>;

	export const citiesUpdateOutput = z.object({
		cityId: Types.Resources.id,
		collectionIds: Types.Resources.id.array(),
	});

	export type CitiesUpdateOutput = z.infer<typeof citiesUpdateOutput>;

	export const relationsPlacesInput = Types.Collection.pick({
		id: true,
	});

	export type RelationsPlacesInput = z.infer<typeof relationsPlacesInput>;

	export const relationsPlacesOutput = z.object({
		places: Types.Places.Extended.array(),
	});

	export type RelationsPlacesOutput = z.infer<typeof relationsPlacesOutput>;

	export const relationsCitiesInput = Types.Collection.pick({
		id: true,
	});

	export type RelationsCitiesInput = z.infer<typeof relationsCitiesInput>;

	export const relationsCitiesOutput = z.object({
		cities: Types.City.array(),
	});

	export type RelationsCitiesOutput = z.infer<typeof relationsCitiesOutput>;
}
