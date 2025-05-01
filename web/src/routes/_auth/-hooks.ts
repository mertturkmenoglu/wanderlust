import { fetchClient } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: FormInput) => {
      await fetchClient.POST('/api/v2/auth/credentials/login', {
        body: data,
      });
    },
    onSuccess: () => {
      window.location.href = '/';
    },
    onError: async (e) => {
      toast.error(e.message);
    },
  });
}
