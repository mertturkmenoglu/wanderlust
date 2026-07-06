import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { Header } from './-header';
import { TripTabs } from './-tabs';

export const Route = createFileRoute('/trips/$id')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.trips.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	errorComponent: ErrorComponent,
	head: ({ loaderData }) => {
		if (!loaderData) {
			const { meta, links } = seo({
				title: 'Trips',
			});

			return {
				meta,
				links,
			};
		}

		const { trip } = loaderData;

		const { meta, links } = seo({
			title: trip.title,
		});

		return {
			meta,
			links,
		};
	},
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
