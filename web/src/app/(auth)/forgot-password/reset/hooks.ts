import api, { ResetPasswordRequestDto } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormInput, FormSchema } from './schema';

const redirectTimeout = 3000;

export function usePasswordResetForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: window.sessionStorage.getItem('forgot-password-email') ?? '',
    },
  });
}

export function usePasswordResetMutation() {
  return useMutation({
    mutationKey: ['password-reset'],
    mutationFn: async (data: FormInput) => {
      const dto: ResetPasswordRequestDto = {
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      };
      await api.post('auth/forgot-password/reset', {
        json: dto,
      });
    },
    onSuccess: () => {
      toast.success(
        'Your password has been reset successfully. Redirecting...'
      );
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, redirectTimeout);
    },
    onError: () => {
      toast.error('Something went wrong. Cannot reset your password.');
    },
  });
}
