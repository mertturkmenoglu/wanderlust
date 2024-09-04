import { z } from 'zod';

const minPasswordLength = 6;

export const FormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  code: z
    .string()
    .min(1, { message: 'Invalid code' })
    .max(16, { message: 'Invalid code' }),
  newPassword: z
    .string()
    .min(minPasswordLength, {
      message: 'Password should be longer than 6 characters',
    })
    .max(64, { message: 'Too long' }),
});

export type FormInput = z.infer<typeof FormSchema>;
