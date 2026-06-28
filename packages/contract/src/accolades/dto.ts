import { $dto, $extended, Pagination } from '@wanderlust/common';
import z from 'zod';

export const createInput = $dto.accolade.pick({
	title: true,
	description: true,
	badge: true,
	image: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	accolade: $dto.accolade,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $dto.accolade.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	accolades: $dto.accolade.array(),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const getInput = $dto.accolade.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	accolade: $dto.accolade,
});

export type GetOutput = z.infer<typeof getOutput>;

export const updateInput = $dto.accolade.pick({
	id: true,
	title: true,
	description: true,
	badge: true,
	image: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	accolade: $dto.accolade,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const getPlacesInput = $dto.accolade
	.pick({
		id: true,
	})
	.extend(Pagination.queryParamsSchema.shape);

export type GetPlacesInput = z.infer<typeof getPlacesInput>;

export const getPlacesOutput = z.object({
	places: z.array(
		z.object({
			place: $extended.place,
			meta: z.object({
				isFavorite: z.boolean(),
			}),
		}),
	),
	pagination: Pagination.schema,
});

export type GetPlacesOutput = z.infer<typeof getPlacesOutput>;
