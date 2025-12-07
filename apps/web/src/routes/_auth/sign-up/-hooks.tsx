import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { authClient } from '@/lib/auth';

const schema = z.object({
	fullName: z
		.string()
		.min(3, { message: 'At least 3 characters' })
		.max(128, { message: 'Full name is too long' }),
	username: z
		.string()
		.min(4, { message: 'At least 4 characters' })
		.max(32, { message: 'Username is too long' }),
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.max(128, { message: 'Email is too long' })
		.email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'At least 8 characters' })
		.max(128, { message: 'Password is too long' })
		.superRefine((data, ctx) => {
			let flag = false;
			if (data.includes(' ')) {
				ctx.addIssue({
					code: 'custom',
					message: 'Password cannot contain spaces',
				});
				flag = true;
			}

			if (!/[A-Z]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one uppercase letter',
				});
				flag = true;
			}

			if (!/[a-z]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one lowercase letter',
				});
				flag = true;
			}

			if (!/[0-9]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one number',
				});
				flag = true;
			}

			if (!/[^A-Za-z0-9]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one special character',
				});
				flag = true;
			}

			if (flag) {
				return z.NEVER;
			}
		}),
});

export function useSignUpForm() {
	return useForm({
		resolver: zodResolver(schema),
		criteriaMode: 'all',
		mode: 'onBlur',
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
		mutationFn: async (data: {
			fullName: string;
			username: string;
			email: string;
			password: string;
		}) => {
			await authClient.signUp.email(
				{
					name: data.fullName,
					username: data.username,
					email: data.email,
					password: data.password,
				},
				{
					throw: true,
				},
			);
		},
		onSuccess: () => {
			window.location.href = '/sign-in';
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err.message || 'Something went wrong');
		},
	});
}
