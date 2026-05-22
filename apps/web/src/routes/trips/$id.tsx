import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { Header } from './-header';
import { schema } from './-hooks';
import { TripTabs } from './-tabs';

export const Route = createFileRoute('/trips/$id')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.trips.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	validateSearch: schema,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />

			<TripTabs className="mb-4" />

			<Outlet />
		</div>
	);
}
