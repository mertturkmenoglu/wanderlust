import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormInput, FormSchema } from './schema';

export function useForgotPasswordForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });
}

export function useForgotPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (data: FormInput) => {
      await api.post('auth/forgot-password/send', {
        json: {
          email: data.email,
        },
      });
    },
    onSuccess: (_, variables) => {
      window.sessionStorage.setItem('forgot-password-email', variables.email);
      router.push('/forgot-password/reset');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
