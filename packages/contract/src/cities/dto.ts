import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const listInput = z.object({});

	export const listOutput = z.object({
		cities: Types.City.array(),
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const listFeaturedInput = z.object({});

	export const listFeaturedOutput = z.object({
		cities: Types.City.array(),
	});

	export type ListFeaturedOutput = z.infer<typeof listFeaturedOutput>;

	export const getInput = Types.City.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		city: Types.City,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const createInput = Types.Cities.$Insert.City;

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		city: Types.City,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const updateInput = createInput.extend({});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = createOutput.extend({});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const deleteInput = Types.City.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;
}
