import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import z from 'zod';
import { AuthLink } from '@/components/auth/link';
import { cmp } from '@/components/form';
import { Logo } from '@/components/logo';
import { authClient } from '@/lib/auth';
import { usePasswordResetForm, usePasswordResetMutation } from './-hooks';

export const Route = createFileRoute('/_auth/password/reset/')({
	component: RouteComponent,
	validateSearch: z.object({
		token: z.string(),
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
	const { token } = Route.useSearch();
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
			className="mx-auto my-32 w-full max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Reset Password</FieldLegend>
					<FieldDescription>
						Already have an account? <AuthLink to="/sign-in" text="Sign In" />
					</FieldDescription>
				</FieldSet>

				<cmp.Password
					name="newPassword"
					control={form.control}
					elements={{
						input: {
							placeholder: 'New Password',
							autoComplete: 'new-password',
						},
						label: {
							children: 'New Password',
						},
					}}
					multipleErrors={true}
				/>

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Reset Your Password</span>
				</Button>
			</FieldGroup>
		</form>
	);
}
