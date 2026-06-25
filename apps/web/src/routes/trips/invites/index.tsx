import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '@/components/trips/breadcrumb';
import { EmptyState } from './-empty';
import { listMyInvitesQueryOptions } from './-hooks';
import { InviteItem } from './-item';

export const Route = createFileRoute('/trips/invites/')({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(listMyInvitesQueryOptions);
	},
});

function RouteComponent() {
	const query = useSuspenseQuery(listMyInvitesQueryOptions);
	const invites = query.data.invites;

	return (
		<div>
			<Breadcrumb items={[{ name: 'My Invites', href: '/trips/invites' }]} />

			<div className="my-4 space-y-4">
				{invites.map((invite) => (
					<InviteItem invite={invite} key={invite.id} />
				))}

				{invites.length === 0 && <EmptyState />}
			</div>
		</div>
	);
}
