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
		<form
			onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
			className="mx-auto my-32 max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Forgot Password</FieldLegend>
					<FieldDescription>
						Already have an account? <AuthLink href="/sign-in" text="Sign In" />
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

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Send Code</span>
				</Button>
			</FieldGroup>
		</form>
	);
}
