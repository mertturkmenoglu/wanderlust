import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
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
import { AuthLegalText } from '@/components/auth/legal-text';
import { AuthLink } from '@/components/auth/link';
import { OAuthGroup } from '@/components/auth/oauth-group';
import { Logo } from '@/components/logo';
import { authClient } from '@/lib/auth';
import { normalizeMultipleErrors } from '@/lib/form';
import { useSignUpForm, useSignUpMutation } from './-hooks';

export const Route = createFileRoute('/_auth/sign-up/')({
	component: RouteComponent,
	validateSearch: z.object({
		addSession: z.boolean().optional().catch(false),
	}),
	beforeLoad: async ({ search }) => {
		const session = await authClient.getSession();

		if (session.data?.user && search.addSession !== true) {
			throw redirect({
				to: '/',
			});
		}
	},
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const form = useSignUpForm();
	const mutation = useSignUpMutation();

	return (
		<form
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					email: data.email,
					username: data.username,
					fullName: data.fullName,
					password: data.password,
				});
			})}
			className="mx-auto my-32 w-full max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Create Your Wanderlust Account</FieldLegend>
					<FieldDescription>
						Already have an account? <AuthLink to="/sign-in" text="Sign In" />
					</FieldDescription>
					<FieldGroup className="grid grid-cols-1 md:grid-cols-2">
						<Controller
							name="fullName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="full-name">Full Name</FieldLabel>
									<Input
										{...field}
										id="full-name"
										placeholder="Your name"
										autoComplete="name"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="username"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<Input
										{...field}
										id="username"
										placeholder="Username"
										autoComplete="username"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</FieldSet>

				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								{...field}
								id="email"
								placeholder="Email"
								autoComplete="email"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

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
									errors={normalizeMultipleErrors(fieldState.error?.types)}
								/>
							)}
						</Field>
					)}
				/>

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Sign Up</span>
				</Button>

				<FieldSeparator />

				<OAuthGroup />

				<AuthLegalText />
			</FieldGroup>
		</form>
	);
}
