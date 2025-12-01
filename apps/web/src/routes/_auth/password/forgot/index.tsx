import { createFileRoute, redirect } from '@tanstack/react-router';
import { Controller } from 'react-hook-form';
import { AuthLink } from '@/components/blocks/auth/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth';
import { useForgotPasswordForm, useForgotPasswordMutation } from './-hooks';

export const Route = createFileRoute('/_auth/password/forgot/')({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (session.data?.user) {
			throw redirect({
				to: '/',
			})
		}
	},
});

function RouteComponent() {
	const form = useForgotPasswordForm();
	const mutation = useForgotPasswordMutation();

	return (
		<Card className="mx-auto my-32 flex max-w-lg flex-col gap-2 p-8">
			<img
				src="/logo.png"
				alt="Wanderlust"
				className="size-16 min-h-16 min-w-16"
			/>
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
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									{...field}
									id='email'
									placeholder='Email'
									autoComplete='email'
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
					type='submit'
					disabled={!form.formState.isValid || mutation.isPending}
				>
					{mutation.isPending && <Spinner />}
					<span>Send Code</span>
				</Button>
			</form>
		</Card>
	)
}
