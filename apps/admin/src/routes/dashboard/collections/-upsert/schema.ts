import z from 'zod';

export const schema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
});
