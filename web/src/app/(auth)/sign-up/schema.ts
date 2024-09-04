import { z } from 'zod';

const minFullNameLength = 3;

export const FormSchema = z.object({
  fullName: z
    .string()
    .min(minFullNameLength, { message: 'At least 3 characters' })
    .max(128, { message: 'Value is too long' }),
  username: z
    .string()
    .min(4, { message: 'At least 4 characters' })
    .max(32, { message: 'Value is too long' }),
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type FormInput = z.infer<typeof FormSchema>;
