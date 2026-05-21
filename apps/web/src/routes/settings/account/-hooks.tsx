import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export function useUsernameAvailabilityQuery(debounced: string) {
	const { auth } = useRouteContext({ from: '/settings/account/' });
	const current = auth.user.username;

	return useQuery(
		orpc.users.checkUsernameAvailability.queryOptions({
			input: {
				username: debounced,
			},
			enabled: debounced.length >= 4 && debounced !== current,
			retry: false,
		}),
	);
}

export function useChangeUsernameMutation() {
	const invalidate = useInvalidator();

	return useMutation({
		mutationKey: ['change-username'],
		mutationFn: async (data: { username: string }) => {
			return authClient.updateUser({
				username: data.username,
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: async () => {
			await invalidate();
			await authClient.updateSession();
			toast.success('Username updated');
		},
	});
}

export const changePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: 'Current password is required' })
			.max(128, { message: 'Password is too long' }),
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
		confirmPassword: z.string().min(1).max(128),
	})
	.superRefine((data, ctx) => {
		if (data.newPassword !== data.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['newPassword'],
			});

			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['confirmPassword'],
			});

			return z.NEVER;
		}
	});

export type FormInput = z.infer<typeof changePasswordSchema>;
