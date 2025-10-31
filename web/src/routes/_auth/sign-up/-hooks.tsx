import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'At least 3 characters' })
    .max(128, { message: 'Full name is too long' }),
  username: z
    .string()
    .min(4, { message: 'At least 4 characters' })
    .max(32, { message: 'Username is too long' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .max(128, { message: 'Email is too long' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'At least 8 characters' })
    .max(128, { message: 'Password is too long' })
    .superRefine((data, ctx) => {
      let flag = false;
      if (data.includes(' ')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password cannot contain spaces',
        });
        flag = true;
      }

      if (!/[A-Z]/.test(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one uppercase letter',
        });
        flag = true;
      }

      if (!/[a-z]/.test(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one lowercase letter',
        });
        flag = true;
      }

      if (!/[0-9]/.test(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one number',
        });
        flag = true;
      }

      if (!/[^A-Za-z0-9]/.test(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one special character',
        });
        flag = true;
      }

      if (flag) {
        return z.NEVER;
      }

      return true;
    }),
});

export function useSignUpForm() {
  return useForm({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });
}

export function useSignUpMutation() {
  return api.useMutation('post', '/api/v2/auth/credentials/register', {
    onSuccess: () => {
      globalThis.window.location.href = '/sign-in';
    },
  });
}
