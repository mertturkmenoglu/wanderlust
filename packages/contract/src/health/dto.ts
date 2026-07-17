import z from 'zod';

export namespace dto {
	export const checkInput = z.object({});

	export const checkOutput = z.object({
		message: z.string(),
	});
}
