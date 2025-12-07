import { useMutation } from '@tanstack/react-query';
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
import { cn } from '@wanderlust/ui/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthLegalText } from '@/components/auth/legal-text';
import { AuthLink } from '@/components/auth/link';
import { OAuthButton } from '@/components/auth/oauth-button';
import { authClient } from '@/lib/auth';
import { useSignInForm } from './-hooks';

export const Route = createFileRoute('/_auth/sign-in/')({
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

	const form = useSignInForm();
	const mutation = useMutation({
		mutationKey: ['sign-in'],
		mutationFn: async (data: { email: string; password: string }) => {
			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					throw: true,
				},
			);
		},
		onSuccess: () => {
			window.location.href = '/';
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err.message || 'Something went wrong');
		},
	});

	return (
		<Card className={cn('mx-auto my-32 flex max-w-lg flex-col gap-2 p-8')}>
			<img
				src="/logo.png"
				alt="Wanderlust"
				className="size-16 min-h-16 min-w-16"
			/>
			<h2 className="mt-4 font-bold text-xl">Sign in to Wanderlust</h2>
			<div className="-mt-2 text-muted-foreground text-sm">
				Don&apos;t have an account? <AuthLink href="/sign-up" text="Sign Up" />
			</div>
			<form
				onSubmit={form.handleSubmit((data) => {
					mutation.mutate({
						email: data.email,
						password: data.password,
					});
				})}
				className="mt-4 w-full"
			>
				<FieldGroup className="gap-4">
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
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
								<AuthLink
									href="/password/forgot"
									text="Forgot password?"
									className="justify-end"
								/>
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
					<span>Sign In</span>
				</Button>

				<Separator className="my-4" />

				{showOAuthButtons && (
					<div className="space-y-4">
						<OAuthButton provider="google" text="Sign in with Google" />
						<OAuthButton provider="facebook" text="Sign in with Facebook" />
					</div>
				)}

				<div className="mt-4 text-center">
					<AuthLegalText type="signin" />
				</div>
			</form>
		</Card>
	);
}
