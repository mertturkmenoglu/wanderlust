import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@/lib/auth';

export const FormSchema = z.object({
	email: z.email().min(1, { message: 'Email is required' }),
});

export type FormInput = z.infer<typeof FormSchema>;

function useForgotPasswordForm() {
	return useForm<FormInput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
		},
	});
}

function useForgotPasswordMutation() {
	return useMutation({
		mutationKey: ['forgot-password'],
		mutationFn: async (data: FormInput) => {
			await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: `${globalThis.location.origin}/password/reset`,
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: () => {
			toast.success('Check your email for instructions');
		},
	});
}

export { useForgotPasswordForm, useForgotPasswordMutation };
