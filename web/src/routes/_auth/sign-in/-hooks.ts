import { useInvalidator } from '@/hooks/use-invalidator';
import { fetchClient } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { type FormInput, FormSchema } from './-schema';

export function useSignInForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: FormInput) => {
      return await fetchClient.POST('/api/v2/auth/credentials/login', {
        body: data,
      });
    },
    onSuccess: async (d) => {
      localStorage.setItem('token', d.data?.token.replace('Bearer ', '') ?? '');
      await invalidator.invalidate();
      await navigate({
        to: '/',
        search: {},
      });
      window.location.reload();
    },
  });
}
