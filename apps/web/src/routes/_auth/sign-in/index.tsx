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
import { useSignInForm, useSignInMutation } from './-hooks';

export const Route = createFileRoute('/_auth/sign-in/')({
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
	const form = useSignInForm();
	const mutation = useSignInMutation();

	return (
		<form
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					email: data.email,
					password: data.password,
				});
			})}
			className="mx-auto my-32 max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Sign in to Wanderlust</FieldLegend>
					<FieldDescription>
						Don&apos;t have an account?{' '}
						<AuthLink href="/sign-up" text="Sign Up" />
					</FieldDescription>
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
									autoComplete="current-password"
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							<AuthLink
								href="/password/forgot"
								text="Forgot password?"
								className="justify-end"
							/>
						</Field>
					)}
				/>

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Sign In</span>
				</Button>

				<FieldSeparator />

				<OAuthGroup />

				<AuthLegalText />
			</FieldGroup>
		</form>
	);
}
