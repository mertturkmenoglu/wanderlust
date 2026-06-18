import { createFileRoute } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@wanderlust/ui/components/alert';
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { InfoIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { SettingsField } from '../-components/field';
import { ChangePassword } from './-change-password';
import { ChangeUsername } from './-change-username';
import { useHasProvider } from './-hooks';
import { SocialLogin } from './-social-login';

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
	const hasEmailProvider = useHasProvider('credential');

	return (
		<FieldSet>
			<FieldLegend className="text-xl!">Account</FieldLegend>
			<FieldDescription>Change your account settings</FieldDescription>

			<FieldSeparator />

			<SettingsField.Root>
				<SettingsField.Label>Email Address</SettingsField.Label>

				<SettingsField.Description>
					{auth.user?.email}
				</SettingsField.Description>

				<Alert variant="default" className="mt-2 max-w-sm">
					<InfoIcon />
					<AlertDescription>
						You cannot change your email address
					</AlertDescription>
				</Alert>
			</SettingsField.Root>

			<SettingsField.Root>
				<SettingsField.Label>Username</SettingsField.Label>

				<SettingsField.Description>
					{auth.user?.username}
				</SettingsField.Description>

				<ChangeUsername />
			</SettingsField.Root>

			<SettingsField.Root>
				<SettingsField.Label>Password</SettingsField.Label>

				<SettingsField.Description>********</SettingsField.Description>

				<ChangePassword hasEmailProvider={hasEmailProvider} />
			</SettingsField.Root>

			<FieldSet className="mt-8">
				<FieldLegend className="text-xl!">Social Logins</FieldLegend>
				<FieldDescription>Manage your social logins</FieldDescription>

				<FieldSeparator />

				<div className="flex flex-row items-center gap-4">
					<SocialLogin provider="google" className="w-full md:w-1/3" />

					<SocialLogin provider="facebook" className="w-full md:w-1/3" />
				</div>
			</FieldSet>
		</FieldSet>
	);
}
