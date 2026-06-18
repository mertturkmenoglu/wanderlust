import { createFileRoute } from '@tanstack/react-router';
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Separator } from '@wanderlust/ui/components/separator';
import { SettingsField } from '../-components/field';
import { Form } from './-form';
import { UpdateImage } from './-update-image';

export const Route = createFileRoute('/settings/profile/')({
	component: RouteComponent,
	loader: ({ context: { orpc, queryClient } }) => {
		return queryClient.ensureQueryData(
			orpc.users.getMe.queryOptions({
				input: {},
			}),
		);
	},
});

function RouteComponent() {
	const { profile } = Route.useLoaderData();

	return (
		<FieldSet>
			<FieldLegend className="text-xl!">Profile</FieldLegend>
			<FieldDescription>Update your profile</FieldDescription>

			<FieldSeparator />

			<SettingsField.Root className="flex items-center gap-8">
				<SettingsField.Label className="w-24">Profile</SettingsField.Label>

				<SettingsField.Description>
					<UpdateImage
						fullName={profile.name}
						image={profile.image ?? null}
						fallbackImage="/profile.png"
						action="profile"
					/>
				</SettingsField.Description>
			</SettingsField.Root>

			<SettingsField.Root className="flex items-center gap-8">
				<SettingsField.Label className="w-24">Banner</SettingsField.Label>

				<SettingsField.Description>
					<UpdateImage
						fullName={profile.name}
						image={profile.banner ?? null}
						fallbackImage="https://i.imgur.com/EwvUEmR.jpg"
						action="banner"
					/>
				</SettingsField.Description>
			</SettingsField.Root>

			<Separator className="my-4" />

			<Form />
		</FieldSet>
	);
}
