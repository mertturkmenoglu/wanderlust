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
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Controller } from 'react-hook-form';
import { AuthLink } from '@/components/auth/link';
import { Logo } from '@/components/logo';
import { authClient } from '@/lib/auth';
import { useForgotPasswordForm, useForgotPasswordMutation } from './-hooks';

export const Route = createFileRoute('/_auth/password/forgot/')({
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
	const form = useForgotPasswordForm();
	const mutation = useForgotPasswordMutation();

	return (
		<Card className="mx-auto my-32 flex max-w-lg flex-col gap-2 p-8">
			<Logo variant="medium" />
			<h2 className="mt-4 font-bold text-xl">Forgot Password</h2>
			<div className="-mt-2 text-muted-foreground text-sm">
				Already have an account? <AuthLink href="/sign-in" text="Sign In" />
			</div>
			<form
				onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
				className="mt-4 w-full"
			>
				<FieldGroup>
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
				</FieldGroup>

				<Button
					variant="default"
					className="mt-4 w-full"
					type="submit"
					disabled={!form.formState.isValid || mutation.isPending}
				>
					{mutation.isPending && <Spinner />}
					<span>Send Code</span>
				</Button>
			</form>
		</Card>
	);
}
