import { $dto } from '@wanderlust/common';
import z from 'zod';

export const getInput = $dto.category.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	category: $dto.category,
});

export type GetOutput = z.infer<typeof getOutput>;

export const listInput = z.object({});

export const listOutput = z.object({
	categories: $dto.category.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const createInput = $dto.category.pick({
	id: true,
	name: true,
	image: true,
	attributions: true,
	description: true,
	displayName: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	category: $dto.category,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = createInput.extend({});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = createOutput.extend({});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $dto.category.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});
