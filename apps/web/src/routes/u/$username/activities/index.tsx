import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { AppMessage } from '@/components/app-message';
import { ActivityItem } from './-item';

export const Route = createFileRoute('/u/$username/activities/')({
	component: RouteComponent,
	loader: ({ context: { orpc, queryClient }, params }) =>
		queryClient.ensureQueryData(
			orpc.users.listActivities.queryOptions({
				input: {
					username: params.username,
				},
			}),
		),
});

function RouteComponent() {
	const { activities } = Route.useLoaderData();

	if (activities.length === 0) {
		return <AppMessage empty="No activities" classNames={{ root: 'my-16' }} />;
	}

	return (
		<ItemGroup className="gap-2">
			{activities.map((act, i) => (
				<ActivityItem item={act} key={`activity-${i}`} />
			))}
		</ItemGroup>
	);
}
