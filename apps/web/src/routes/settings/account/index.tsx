import { createFileRoute } from '@tanstack/react-router';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { cn } from '@wanderlust/ui/lib/utils';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { authClient } from '@/lib/auth';
import { ChangePassword } from './-change-password';
import { ChangeUsername } from './-change-username';

export const Route = createFileRoute('/settings/account/')({
	component: RouteComponent,
	loader: async () => {
		const accounts = await authClient.listAccounts();

		return {
			accounts,
		};
	},
});

function RouteComponent() {
	const { auth } = Route.useRouteContext();
	const { accounts } = Route.useLoaderData();
	const providers = (accounts.data ?? []).map((acc) => acc.providerId);
	const hasEmailProvider = providers.includes('credential');
	const hasGoogleProvider = providers.includes('google');
	const hasFacebookProvider = providers.includes('facebook');

	return (
		<FieldSet>
			<FieldLegend>Account</FieldLegend>
			<FieldDescription>Change your account settings</FieldDescription>

			<FieldSeparator />

			<FieldGroup>
				<FieldGroup className="grid grid-cols-1 md:grid-cols-2">
					<Field>
						<FieldLabel>Email</FieldLabel>
						<Input id="name" disabled value={auth.user?.email} />
						<FieldDescription>
							You cannot change your email address
						</FieldDescription>
					</Field>

					<Field className="flex flex-col justify-start">
						<FieldLabel>Username</FieldLabel>
						<Input id="username" disabled value={auth.user?.username} />
						<FieldDescription>
							<ChangeUsername />
						</FieldDescription>
					</Field>
				</FieldGroup>

				<Field>
					<FieldLabel>Password</FieldLabel>
					<Input id="password" disabled value="********" />
					<FieldDescription>
						<ChangePassword hasEmailProvider={hasEmailProvider} />
					</FieldDescription>
				</Field>
			</FieldGroup>

			<FieldSeparator />

			<FieldGroup>
				<Field className="flex flex-row gap-16">
					<FieldLabel className="max-w-fit">Social Logins</FieldLabel>
					<div className="flex flex-row items-center gap-4">
						<GoogleIcon
							className={cn('size-6', {
								grayscale: !hasGoogleProvider,
							})}
						/>

						<FacebookIcon
							className={cn('size-6', {
								grayscale: !hasFacebookProvider,
							})}
						/>
					</div>
				</Field>
			</FieldGroup>
		</FieldSet>
	);
}
