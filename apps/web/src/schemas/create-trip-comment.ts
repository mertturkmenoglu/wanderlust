import z from "zod";

export const createTripCommentSchema = z.object({
	content: z.string({ error: 'Required' }).min(1),
});

export type CreateTripCommentFormInput = z.infer<typeof createTripCommentSchema>;
