import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth';
import { type FormInput, FormSchema } from './-schema';

function usePasswordResetForm() {
	return useForm<FormInput>({
		resolver: zodResolver(FormSchema),
		criteriaMode: 'all',
		mode: 'onBlur',
		defaultValues: {},
	});
}

function usePasswordResetMutation() {
	const navigate = useNavigate();

	return useMutation({
		mutationKey: ['password-reset'],
		mutationFn: async (data: FormInput & { token: string }) => {
			await authClient.resetPassword({
				newPassword: data.newPassword,
				token: data.token,
				fetchOptions: {
					throw: true,
				},
			});

			await navigate({
				to: '/sign-in',
			});
		},
	});
}

export { usePasswordResetForm, usePasswordResetMutation };
