import { fetchClient } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { type FormInput, FormSchema } from './-schema';

function useForgotPasswordForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });
}

function useForgotPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (data: FormInput) => {
      return await fetchClient.POST('/api/v2/auth/forgot-password/send', {
        body: {
          email: data.email,
        },
      });
    },
    onSuccess: (_, variables) => {
      globalThis.window.sessionStorage.setItem(
        'forgot-password-email',
        variables.email,
      );
      navigate({ to: '/forgot-password/reset' });
    },
  });
}

export { useForgotPasswordForm, useForgotPasswordMutation };
