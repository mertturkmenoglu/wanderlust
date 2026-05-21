import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { authClient, isAuthError } from '@/lib/auth';

const schema = z.object({
	email: z.email().min(1, { message: 'Email is required' }),
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
	const navigate = useNavigate();
	const search = useSearch({ from: '/_auth/sign-in/' });

	return useMutation({
		mutationKey: ['sign-in'],
		mutationFn: async (data: { email: string; password: string }) => {
			return await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					throw: true,
				},
			);
		},
		onSuccess: async () => {
			if (search.addSession === true) {
				await authClient.updateSession();
			}

			await navigate({ to: '/' });
			window.location.reload();
		},
		retry: false,
		onError: (err) => {
			if (isAuthError(err) && err.error.code === 'INVALID_EMAIL_OR_PASSWORD') {
				toast.error('Invalid email or password');
				return;
			}

			toast.error(err.message || 'Something went wrong');
		},
	});
}
