import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { useTripSummary } from './-hooks';
import { SummaryCard } from './-summary-card';

export const Route = createFileRoute('/trips/$id/')({
	component: RouteComponent,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(
			orpc.trips.getSummary.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
});

function RouteComponent() {
	const items = useTripSummary();

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
			{items.map((item, index) => (
				<SummaryCard key={index} {...item} />
			))}
		</div>
	);
}
