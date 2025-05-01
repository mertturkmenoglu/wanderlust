import { fetchClient } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput, FormSchema } from './-schema';

export function useSignUpForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationKey: ['sign-up'],
    mutationFn: async (data: FormInput) => {
      return await fetchClient.POST('/api/v2/auth/credentials/register', {
        body: data,
      });
    },
    onSuccess: () => {
      window.location.href = '/sign-in';
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
