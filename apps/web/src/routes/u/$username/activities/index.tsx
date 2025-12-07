/** biome-ignore-all lint/suspicious/noArrayIndexKey: TODO */
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { AppMessage } from '@/components/app-message';
import { orpc } from '@/lib/orpc';
import { ActivityCard, type UserActivityType } from './-activity-card';

export const Route = createFileRoute('/u/$username/activities/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { username } = Route.useParams();

	const query = useQuery(
		orpc.users.listActivities.queryOptions({
			input: {
				username,
			},
		}),
	);

	if (query.error) {
		return (
			<AppMessage
				errorMessage="Something went wrong"
				className="my-16"
				showBackButton={false}
			/>
		);
	}

	if (query.data) {
		const activities = query.data.activities;

		if (activities.length === 0) {
			return (
				<AppMessage
					emptyMessage="No activities"
					showBackButton={false}
					className="my-16"
				/>
			);
		}

		return (
			<div className="space-y-4">
				{activities.map((act, i) => (
					<ActivityCard
						activity={{
							type: act.type as unknown as UserActivityType,
							payload: act.payload as unknown as Record<string, unknown>,
						}}
						key={`activity-${i}`}
					/>
				))}
			</div>
		);
	}

	return (
		<LoaderCircleIcon className="mx-auto my-16 size-8 animate-spin text-primary" />
	);
}
