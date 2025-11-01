import { fetchClient } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput, FormSchema } from './-schema';

const redirectTimeout = 3000;

function usePasswordResetForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    criteriaMode: 'all',
    mode: 'onBlur',
    defaultValues: {
      email:
        globalThis.window.sessionStorage.getItem('forgot-password-email') ?? '',
    },
  });
}

function usePasswordResetMutation() {
  return useMutation({
    mutationKey: ['password-reset'],
    mutationFn: async (data: FormInput) => {
      await fetchClient.POST('/api/v2/auth/forgot-password/reset', {
        body: {
          code: data.code,
          email: data.email,
          newPassword: data.newPassword,
        },
      });
    },
    onSuccess: () => {
      toast.success(
        'Your password has been reset successfully. Redirecting...',
      );
      setTimeout(() => {
        globalThis.window.location.href = '/sign-in';
      }, redirectTimeout);
    },
  });
}

export { usePasswordResetForm, usePasswordResetMutation };
