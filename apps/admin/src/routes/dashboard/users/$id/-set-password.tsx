import { zodResolver } from '@hookform/resolvers/zod';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { normalizeMultipleErrors } from '@/lib/form';

const schema = z.object({
	password: z
		.string()
		.min(8, { error: 'At least 8 characters' })
		.max(128, { error: 'At most 128 characters' })
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

export function SetPassword() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });
	const invalidate = useInvalidator();
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm({
		resolver: zodResolver(schema),
		criteriaMode: 'all',
	});

	const mutation = useMutation({
		mutationKey: ['set-password', data?.id],
		mutationFn: async ({ password }: { password: string }) => {
			const res = await authClient.admin.setUserPassword({
				userId: data?.id ?? '',
				newPassword: password,
			});

			if (res.error) {
				throw new Error(res.error.message);
			}

			return res.data;
		},
		onSuccess: async () => {
			await invalidate();
			toast.success('Password set successfully');
			setOpen(false);
		},
	});

	if (!data) {
		return null;
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive-ghost"
					size="sm"
					disabled={data.role === 'admin'}
					onClick={() => setOpen(true)}
				>
					<LockClosedIcon />
					Set Password
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Set Password for {data.name}</AlertDialogTitle>
					<AlertDialogDescription>
						<form
							id="set-password-form"
							onSubmit={form.handleSubmit((data) => {
								mutation.mutate(data);
							})}
						>
							<FieldGroup className="gap-4">
								<Controller
									name="password"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="password">Password</FieldLabel>

											<InputGroup>
												<InputGroupInput
													{...field}
													id="password"
													placeholder="Password"
													aria-invalid={fieldState.invalid}
													type={showPassword ? 'text' : 'password'}
													autoComplete="new-password"
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() => setShowPassword((prev) => !prev)}
													>
														{showPassword ? (
															<EyeIcon className="size-4" />
														) : (
															<EyeOffIcon className="size-4" />
														)}
													</InputGroupButton>
												</InputGroupAddon>
											</InputGroup>
											{fieldState.invalid && (
												<FieldError
													errors={normalizeMultipleErrors(
														fieldState.error?.types,
													)}
												/>
											)}
										</Field>
									)}
								/>
							</FieldGroup>
						</form>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<Button variant="destructive" type="submit" form="set-password-form">
						Set Password
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
