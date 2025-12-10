import z from 'zod';

export const listInput = z.object({});

export const listOutput = z.object({
	amenities: z.array(z.string()),
});
