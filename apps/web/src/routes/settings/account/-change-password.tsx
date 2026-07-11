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
import { FieldGroup } from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cmp } from '@/components/form';
import { authClient } from '@/lib/auth';
import { changePasswordSchema, type FormInput } from './-hooks';

export function ChangePassword({
	hasEmailProvider,
}: {
	hasEmailProvider: boolean;
}) {
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
								<cmp.Password
									name="currentPassword"
									control={form.control}
									elements={{
										input: {
											placeholder: 'Current Password',
											autoComplete: 'current-password',
										},
										label: {
											children: 'Current Password',
										},
									}}
								/>

								<cmp.Password
									name="newPassword"
									control={form.control}
									elements={{
										input: {
											placeholder: 'New Password',
											autoComplete: 'new-password',
										},
										label: {
											children: 'New Password',
										},
									}}
									multipleErrors={true}
								/>

								<cmp.Password
									name="confirmPassword"
									control={form.control}
									elements={{
										input: {
											placeholder: 'Confirm Password',
											autoComplete: 'new-password',
										},
										label: {
											children: 'Confirm Password',
										},
									}}
									multipleErrors={true}
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
