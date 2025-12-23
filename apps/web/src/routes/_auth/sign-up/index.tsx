import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Card } from '@wanderlust/ui/components/card';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { AuthLegalText } from '@/components/auth/legal-text';
import { AuthLink } from '@/components/auth/link';
import { OAuthButton } from '@/components/auth/oauth-button';
import { authClient } from '@/lib/auth';
import { normalizeMultipleErrors } from '@/lib/form';
import { useSignUpForm, useSignUpMutation } from './-hooks';

export const Route = createFileRoute('/_auth/sign-up/')({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (session.data?.user) {
			throw redirect({
				to: '/',
			});
		}
	},
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const showOAuthButtons = true;

	const form = useSignUpForm();
	const mutation = useSignUpMutation();

	return (
		<Card className="mx-auto my-32 flex max-w-lg flex-col gap-2 p-8">
			<img
				src="/logo.png"
				alt="Wanderlust"
				className="size-16 min-h-16 min-w-16"
			/>
			<h2 className="mt-4 font-bold text-xl">Create Your Wanderlust Account</h2>
			<div className="-mt-2 text-muted-foreground text-sm">
				Already have an account? <AuthLink href="/sign-in" text="Sign In" />
			</div>
			<form
				onSubmit={form.handleSubmit((data) => {
					mutation.mutate({
						email: data.email,
						username: data.username,
						fullName: data.fullName,
						password: data.password,
					});
				})}
				className="mt-4 w-full"
			>
				<FieldGroup className="gap-4">
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
				</FieldGroup>

				<Button
					variant="default"
					className="mt-4 w-full"
					type="submit"
					disabled={!form.formState.isValid || mutation.isPending}
				>
					{mutation.isPending && <Spinner />}
					<span>Sign Up</span>
				</Button>

				<Separator className="my-4" />

				{showOAuthButtons && (
					<div className="space-y-4">
						<OAuthButton provider="google" text="Sign up with Google" />
						<OAuthButton provider="facebook" text="Sign up with Facebook" />
					</div>
				)}

				<div className="mt-4 text-center">
					<AuthLegalText type="signup" />
				</div>
			</form>
		</Card>
	);
}
