import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
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
import { Controller } from 'react-hook-form';
import z from 'zod';
import { AuthLink } from '@/components/auth/link';
import { Logo } from '@/components/logo';
import { authClient } from '@/lib/auth';
import { normalizeMultipleErrors } from '@/lib/form';
import { usePasswordResetForm, usePasswordResetMutation } from './-hooks';

export const Route = createFileRoute('/_auth/password/reset/')({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (session.data?.user) {
			throw redirect({
				to: '/',
			});
		}
	},
	validateSearch: z.object({
		token: z.string(),
	}),
});

function RouteComponent() {
	const { token } = Route.useSearch();
	const [showPassword, setShowPassword] = useState(false);
	const form = usePasswordResetForm();
	const mutation = usePasswordResetMutation();

	return (
		<form
			onSubmit={form.handleSubmit((data) =>
				mutation.mutate({
					...data,
					token,
				}),
			)}
			className="mx-auto my-32 max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Reset Password</FieldLegend>
					<FieldDescription>
						Already have an account? <AuthLink href="/sign-in" text="Sign In" />
					</FieldDescription>
				</FieldSet>

				<Controller
					name="newPassword"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="new-password">New Password</FieldLabel>

							<InputGroup>
								<InputGroupInput
									{...field}
									id="new-password"
									placeholder="New Password"
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
									errors={normalizeMultipleErrors(fieldState.error?.types)}
								/>
							)}
						</Field>
					)}
				/>

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Reset Your Password</span>
				</Button>
			</FieldGroup>
		</form>
	);
}
