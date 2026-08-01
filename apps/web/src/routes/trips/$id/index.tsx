import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { CollapsibleText } from '@/components/collapsible-text';
import { orpc } from '@/lib/orpc';
import { CitiesSection } from './-components/cities-section';
import { useTripSummary } from './-components/hooks';
import { MapSection } from './-components/map';
import { SummaryCard } from './-components/summary-card';

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
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
				<CollapsibleText
					className="col-span-full"
					text={
						trip.description.length > 0 ? trip.description : 'No description.'
					}
					charLimit={500}
				/>

				{items.map((item) => (
					<SummaryCard key={`${item.explain}-${item.title}`} {...item} />
				))}
			</div>

			<CitiesSection className="mt-8" />

			<MapSection className="mt-8" />
		</div>
	);
}
