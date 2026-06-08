import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { PlusIcon } from 'lucide-react';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { placesCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DashboardLink } from '@/components/dashboard/link';

export const Route = createFileRoute('/dashboard/places/')({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.places.peek.queryOptions({
				input: {},
			}),
		),
});

function RouteComponent() {
	const { places } = Route.useLoaderData();

	return (
		<>
			<DashboardBreadcrumb
				items={[{ name: 'Places', href: '/dashboard/places' }]}
			/>

			<Separator className="my-4" />

			<DashboardActions>
				<DashboardLink
					to="/dashboard/places/new"
					icon={PlusIcon}
					title="New Place"
				/>
			</DashboardActions>

			<DataTable
				columns={placesCols}
				filterColumnId="name"
				data={places.map((p) => ({
					...p,
					city: p.address.city.name,
					country: p.address.city.countryName,
					category: p.category.name,
				}))}
				hrefPrefix="/dashboard/places"
			/>
		</>
	);
}
