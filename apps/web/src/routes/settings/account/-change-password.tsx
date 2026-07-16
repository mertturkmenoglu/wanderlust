import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { FieldGroup } from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormElement } from '@/components/form';
import { PasswordShow } from '@/components/form/password-show';
import { authClient } from '@/lib/auth';
import {
	changePasswordSchema,
	type FormInput,
	usePasswordState,
} from './-hooks';

export function ChangePassword({
	hasEmailProvider,
}: {
	hasEmailProvider: boolean;
}) {
	const [show, setShow] = usePasswordState();

	const [open, setOpen] = useState(false);

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

	const { Element } = useFormElement(form.control);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
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
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change Password</AlertDialogTitle>
				</AlertDialogHeader>
				<form
					id="change-password-form"
					onSubmit={form.handleSubmit((data) => {
						mutation.mutate({
							body: data,
						});
					})}
				>
					<FieldGroup className="gap-4">
						<Element
							name="currentPassword"
							label="Current Password"
							multipleErrors
						>
							{(r, id) => (
								<InputGroup>
									<InputGroupInput
										id={id}
										placeholder="Current Password"
										aria-invalid={r.fieldState.invalid}
										type={show.current ? 'text' : 'password'}
										{...r.field}
									/>
									<PasswordShow
										show={show.current}
										onShowChange={() => setShow({ type: 'current' })}
									/>
								</InputGroup>
							)}
						</Element>

						<Element name="newPassword" label="New Password" multipleErrors>
							{(r, id) => (
								<InputGroup>
									<InputGroupInput
										id={id}
										placeholder="New Password"
										aria-invalid={r.fieldState.invalid}
										type={show.new ? 'text' : 'password'}
										{...r.field}
									/>
									<PasswordShow
										show={show.new}
										onShowChange={() => setShow({ type: 'new' })}
									/>
								</InputGroup>
							)}
						</Element>

						<Element
							name="confirmPassword"
							label="Confirm Password"
							multipleErrors
						>
							{(r, id) => (
								<InputGroup>
									<InputGroupInput
										id={id}
										placeholder="Confirm Password"
										aria-invalid={r.fieldState.invalid}
										type={show.confirm ? 'text' : 'password'}
										{...r.field}
									/>
									<PasswordShow
										show={show.confirm}
										onShowChange={() => setShow({ type: 'confirm' })}
									/>
								</InputGroup>
							)}
						</Element>
					</FieldGroup>
				</form>
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
