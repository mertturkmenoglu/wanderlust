import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type FormInput = z.infer<typeof FormSchema>;
