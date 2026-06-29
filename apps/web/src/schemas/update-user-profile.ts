import z from 'zod';

export const updateUserProfileSchema = z.object({
	fullName: z.string().min(1).max(128),
	bio: z.string().max(255).optional(),
	website: z.string().max(255).optional(),
});

export type UpdateUserProfileFormInput = z.infer<
	typeof updateUserProfileSchema
>;
