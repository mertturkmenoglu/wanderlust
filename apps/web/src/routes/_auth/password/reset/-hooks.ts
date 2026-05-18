import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@/lib/auth';

export const FormSchema = z.object({
	newPassword: z
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

export type FormInput = z.infer<typeof FormSchema>;

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

			toast.success(
				'Password reset successfully! Please sign in with your new password.',
			);

			await navigate({
				to: '/sign-in',
			});
		},
	});
}

export { usePasswordResetForm, usePasswordResetMutation };
