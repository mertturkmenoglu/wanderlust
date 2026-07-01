import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import z from 'zod';
import { AuthLegalText } from '@/components/auth/legal-text';
import { AuthLink } from '@/components/auth/link';
import { OAuthGroup } from '@/components/auth/oauth-group';
import { cmp } from '@/components/form';
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
			className="mx-auto my-32 w-full max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Sign in to Wanderlust</FieldLegend>
					<FieldDescription>
						Don&apos;t have an account?{' '}
						<AuthLink to="/sign-up" text="Sign Up" />
					</FieldDescription>
				</FieldSet>

				<cmp.Input
					name="email"
					control={form.control}
					elements={{
						input: {
							placeholder: 'Email',
							autoComplete: 'email',
						},
					}}
				/>

				<cmp.Password
					name="password"
					control={form.control}
					elements={{
						input: {
							placeholder: 'Password',
							autoComplete: 'current-password',
						},
					}}
				/>

				<AuthLink
					to="/password/forgot"
					text="Forgot password?"
					className="justify-end"
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
