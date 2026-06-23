import { $dto } from '@wanderlust/common';
import z from 'zod';

export const getInput = z.object({});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	preferences: $dto.preference,
});

export type GetOutput = z.infer<typeof getOutput>;

export const updateInput = $dto.preference.omit({
	userId: true,
}).partial();

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	preferences: $dto.preference,
});

export type UpdateOutput = z.infer<typeof updateOutput>;
