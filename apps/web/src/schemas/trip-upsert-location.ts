import z from 'zod';

export const tripUpsertLocationSchema = z.object({
	dialog: z.boolean().optional(),
	placeId: z.string().optional(),
	update: z.boolean().optional(),
	description: z.string().optional(),
	time: z.string().optional(),
	locId: z.string().optional(),
});
