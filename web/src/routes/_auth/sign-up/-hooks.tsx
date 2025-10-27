import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'At least 3 characters' })
    .max(128, { message: 'Value is too long' }),
  username: z
    .string()
    .min(4, { message: 'At least 4 characters' })
    .max(32, { message: 'Value is too long' }),
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function useSignUpForm() {
  return useForm({
    resolver: zodResolver(schema),
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
