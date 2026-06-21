import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useListActivitiesQuery() {
	const { username } = useParams({ from: '/u/$username/activities/' });

	return useSuspenseQuery(
		orpc.users.listActivities.queryOptions({
			input: {
				username,
			},
		}),
	);
}
