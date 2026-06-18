import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { Spinner } from '@wanderlust/ui/components/spinner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth';
import { normalizeMultipleErrors } from '@/lib/form';
import { changePasswordSchema, type FormInput } from './-hooks';

export function ChangePassword({
	hasEmailProvider,
}: {
	hasEmailProvider: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm({
		resolver: zodResolver(changePasswordSchema),
		mode: 'onBlur',
		criteriaMode: 'all',
	});

	const mutation = useMutation({
		mutationKey: ['change-password'],
		mutationFn: async (data: { body: FormInput }) => {
			await authClient.changePassword({
				currentPassword: data.body.currentPassword,
				newPassword: data.body.newPassword,
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: () => {
			toast.success('Password changed successfully.');
			form.reset();
			setOpen(false);
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="link"
					size="sm"
					className="px-0!"
					disabled={!hasEmailProvider}
				>
					{hasEmailProvider
						? 'Change'
						: 'Sign up with email to change password'}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change Password</AlertDialogTitle>
					<AlertDialogDescription>
						<form
							id="change-password-form"
							onSubmit={form.handleSubmit((data) => {
								mutation.mutate({
									body: data,
								});
							})}
						>
							<FieldGroup className="gap-4">
								<Controller
									name="currentPassword"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="current-password">
												Current Password
											</FieldLabel>

											<InputGroup>
												<InputGroupInput
													{...field}
													id="current-password"
													placeholder="Current Password"
													autoComplete="current-password"
													type={showCurrentPassword ? 'text' : 'password'}
													aria-invalid={fieldState.invalid}
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() =>
															setShowCurrentPassword((prev) => !prev)
														}
													>
														{showCurrentPassword ? (
															<EyeIcon className="size-4" />
														) : (
															<EyeOffIcon className="size-4" />
														)}
													</InputGroupButton>
												</InputGroupAddon>
											</InputGroup>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="newPassword"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="new-password">
												New Password
											</FieldLabel>
											<InputGroup>
												<InputGroupInput
													{...field}
													id="new-password"
													placeholder="New Password"
													autoComplete="new-password"
													type={showNewPassword ? 'text' : 'password'}
													aria-invalid={fieldState.invalid}
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() => setShowNewPassword((prev) => !prev)}
													>
														{showNewPassword ? (
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

								<Controller
									name="confirmPassword"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="confirm-password">
												Confirm Password
											</FieldLabel>
											<InputGroup>
												<InputGroupInput
													{...field}
													id="confirm-password"
													placeholder="Confirm Password"
													type={showConfirmPassword ? 'text' : 'password'}
													aria-invalid={fieldState.invalid}
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() =>
															setShowConfirmPassword((prev) => !prev)
														}
													>
														{showConfirmPassword ? (
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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						type="submit"
						form="change-password-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending && <Spinner />}
						<span>Change Password</span>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
