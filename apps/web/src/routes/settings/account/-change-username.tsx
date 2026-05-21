import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useRouteContext } from '@tanstack/react-router';
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
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import {
	useChangeUsernameMutation,
	useUsernameAvailabilityQuery,
} from './-hooks';

const schema = z.object({
	username: z
		.string()
		.min(4, { error: 'At least 4 characters' })
		.max(32, { error: 'At most 32 characters' }),
});

export function ChangeUsername() {
	const { auth } = useRouteContext({ from: '/settings/account/' });
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			username: auth.user.username,
		},
		mode: 'onChange',
	});

	const [debounced] = useDebouncedValue(form.watch('username'), {
		wait: 1000,
	});

	const query = useUsernameAvailabilityQuery(debounced);
	const mutation = useChangeUsernameMutation();

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="link" size="sm" className="px-0!">
					Change Username
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change Username</AlertDialogTitle>
					<AlertDialogDescription>
						<form
							id="change-username-form"
							onSubmit={form.handleSubmit(async (data) => {
								mutation.mutate(data, {
									onSuccess: () => {
										setOpen(false);
									},
								});
							})}
						>
							<FieldGroup>
								<Controller
									name="username"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>New Username</FieldLabel>
											<Input
												{...field}
												id={field.name}
												name={field.name}
												placeholder="Enter your new username"
												aria-invalid={fieldState.invalid}
											/>
											<FieldDescription>
												{fieldState.isDirty ? (
													<Description debounced={debounced} />
												) : (
													'Type your new username to check if it is available'
												)}
											</FieldDescription>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
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
						form="change-username-form"
						disabled={!query.data?.available}
					>
						Change
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function Description({ debounced }: { debounced: string }) {
	const query = useUsernameAvailabilityQuery(debounced);

	if (query.isLoading) {
		return <span>Checking...</span>;
	}

	if (query.isError) {
		return <span className="text-destructive">Error checking username</span>;
	}

	if (query.isSuccess) {
		return (
			<span
				className={query.data.available ? 'text-green-600' : 'text-destructive'}
			>
				{query.data.available
					? 'Username is available'
					: 'Username is already taken'}
			</span>
		);
	}

	return <span />;
}
