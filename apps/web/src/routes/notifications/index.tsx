import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { authGuard } from '@/lib/auth';
import { useNotificationsContext } from '@/stores/notifications-context';
import { Actions } from './-actions';
import { EmptyState } from './-empty';
import { Filters } from './-filters';
import { NotificationItem } from './-item';

export const Route = createFileRoute('/notifications/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	const { filtered } = useNotificationsContext();

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
				<Filters />

				<Actions />
			</div>
			<ItemGroup className="mt-4 gap-2">
				{filtered.map((item) => (
					<NotificationItem key={item.id} item={item} />
				))}
				{filtered.length === 0 && <EmptyState />}
			</ItemGroup>
		</div>
	);
}
