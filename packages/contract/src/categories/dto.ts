import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const getInput = Types.Category.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		category: Types.Category,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const listInput = z.object({});

	export const listOutput = z.object({
		categories: Types.Category.array(),
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const createInput = Types.Categories.$Insert.Category;

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		category: Types.Category,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const updateInput = createInput.extend({});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = createOutput.extend({});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const deleteInput = Types.Category.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;
}
