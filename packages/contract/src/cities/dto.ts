import { $dto } from '@wanderlust/common';
import z from 'zod';

export const listInput = z.object({});

export const listOutput = z.object({
	cities: $dto.city.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const listFeaturedInput = z.object({});

export const listFeaturedOutput = z.object({
	cities: $dto.city.array(),
});

export type ListFeaturedOutput = z.infer<typeof listFeaturedOutput>;

export const getInput = $dto.city.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	city: $dto.city,
});

export type GetOutput = z.infer<typeof getOutput>;

export const createInput = $dto.city;

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	city: $dto.city,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = createInput;

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = createOutput;

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $dto.city.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});
