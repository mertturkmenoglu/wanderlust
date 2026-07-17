import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const createInput = Types.Accolades.$Insert.Accolade;

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		accolade: Types.Accolade,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const deleteInput = Types.Accolade.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const listInput = Types.Pagination.queryParamsSchema.extend({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		accolades: Types.Accolade.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const getInput = Types.Accolade.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		accolade: Types.Accolade,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const updateInput = Types.Accolade.pick({
		id: true,
		title: true,
		description: true,
		badge: true,
		image: true,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		accolade: Types.Accolade,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const listPlacesInput = Types.Accolade.pick({
		id: true,
	}).extend(Types.Pagination.queryParamsSchema.shape);

	export type ListPlacesInput = z.infer<typeof listPlacesInput>;

	export const listPlacesOutput = z.object({
		places: z.array(
			z.object({
				place: Types.Places.Extended,
				meta: Types.Places.Meta,
			}),
		),
		pagination: Types.Pagination.schema,
	});

	export type ListPlacesOutput = z.infer<typeof listPlacesOutput>;
}
