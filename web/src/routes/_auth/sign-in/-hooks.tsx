import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function useSignInForm() {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
}

export function useSignInMutation() {
  return api.useMutation('post', '/api/v2/auth/credentials/login', {
    onSuccess: () => {
      globalThis.window.location.href = '/';
      globalThis.window.location.search = '';
    },
  });
}
