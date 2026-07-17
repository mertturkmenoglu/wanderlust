import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const getInput = z.object({});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		preferences: Types.Preference,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const updateInput = Types.Preference.omit({
		userId: true,
	}).partial();

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		preferences: Types.Preference,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;
}
