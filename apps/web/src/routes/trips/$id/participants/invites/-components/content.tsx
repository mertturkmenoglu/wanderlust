import { DenseList } from '@/components/dense-list';
import { EmptyState } from './empty';
import { useListInvitesQuery } from './hooks';
import { InviteItem } from './item';

export function Content() {
	const query = useListInvitesQuery();
	const invites = query.data.invites;

	if (invites.length === 0) {
		return <EmptyState />;
	}

	return (
		<div>
			<DenseList
				data={invites}
				className="mt-4"
				keyExtractor={(invite) => `trip-invite-${invite.id}`}
				renderItem={(invite, className) => (
					<InviteItem invite={invite} className={className} />
				)}
			/>
		</div>
	);
}
