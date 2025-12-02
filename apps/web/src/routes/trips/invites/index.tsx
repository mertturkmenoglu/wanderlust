import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '@/components/blocks/trips/breadcrumb';
import { EmptyState } from './-empty';
import { InviteItem } from './-item';

export const Route = createFileRoute('/trips/invites/')({
	component: RouteComponent,
	loader: ({ context }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.trips.listMyInvites.queryOptions({
				input: {},
			}),
		);
	},
});

function RouteComponent() {
	const { invites } = Route.useLoaderData();

	return (
		<div>
			<Breadcrumb items={[{ name: 'My Invites', href: '/trips/invites' }]} />
			<div className="my-4 mb-96 space-y-4">
				{invites.map((invite) => (
					<InviteItem invite={invite} key={invite.id} />
				))}
				{invites.length === 0 && <EmptyState />}
			</div>
		</div>
	);
}
