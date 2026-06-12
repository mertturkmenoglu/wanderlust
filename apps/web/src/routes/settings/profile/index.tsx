import { createFileRoute } from '@tanstack/react-router';
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Label } from '@wanderlust/ui/components/label';
import { Separator } from '@wanderlust/ui/components/separator';
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
			<FieldLegend>Profile</FieldLegend>
			<FieldDescription>Update your profile</FieldDescription>

			<FieldSeparator />

			<div className="mt-4 grid grid-cols-3 items-center gap-4">
				<Label>Profile Image</Label>
				<div className="col-span-2 flex">
					<UpdateImage
						fullName={profile.name}
						image={profile.image ?? null}
						fallbackImage="/profile.png"
						action="profile"
					/>
				</div>

				<Label>Banner Image</Label>
				<div className="col-span-2 flex">
					<UpdateImage
						fullName={profile.name}
						image={profile.banner ?? null}
						fallbackImage="https://i.imgur.com/EwvUEmR.jpg"
						action="banner"
					/>
				</div>
			</div>

			<Separator className="my-4" />

			<Form />
		</FieldSet>
	);
}
