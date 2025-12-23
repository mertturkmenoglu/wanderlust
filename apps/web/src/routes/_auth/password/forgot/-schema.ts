import { z } from 'zod';

export const FormSchema = z.object({
	email: z.email().min(1, { message: 'Email is required' }),
});

export type FormInput = z.infer<typeof FormSchema>;
