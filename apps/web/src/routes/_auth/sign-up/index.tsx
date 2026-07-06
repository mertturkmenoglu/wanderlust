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
import { seo } from '@/lib/seo';
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
	head: () =>
		seo({
			title: 'Sign Up',
			description: 'Create a Wanderlust account',
			applicationName: 'Wanderlust',
			openGraph: {
				title: 'Sign Up',
				type: 'website',
				url: '/sign-up',
				locale: 'en_US',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
				description: 'Create a Wanderlust account',
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: 'Sign Up',
				description: 'Create a Wanderlust account',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
			},
		}),
});

function RouteComponent() {
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
						<cmp.Input
							name="fullName"
							control={form.control}
							elements={{
								label: {
									children: 'Full Name',
								},
								input: {
									placeholder: 'Full Name',
									autoComplete: 'name',
								},
							}}
						/>

						<cmp.Input
							name="username"
							control={form.control}
							elements={{
								input: {
									placeholder: 'Username',
									autoComplete: 'username',
								},
							}}
						/>
					</FieldGroup>
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
							autoComplete: 'new-password',
						},
					}}
					multipleErrors={true}
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
