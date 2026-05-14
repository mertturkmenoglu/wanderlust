import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { PlusIcon } from 'lucide-react';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { citiesCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DashboardLink } from '@/components/dashboard/link';

export const Route = createFileRoute('/_admin/dashboard/cities/')({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.cities.list.queryOptions({
				input: {},
			}),
		),
});

function RouteComponent() {
	const { cities } = Route.useLoaderData();

	return (
		<div>
			<DashboardBreadcrumb
				items={[{ name: 'Cities', href: '/dashboard/cities' }]}
			/>

			<Separator className="my-4" />

			<DashboardActions>
				<DashboardLink
					to="/dashboard/cities/new"
					icon={PlusIcon}
					title="New City"
				/>
			</DashboardActions>

			<DataTable
				columns={citiesCols}
				filterColumnId="name"
				data={cities}
				hrefPrefix="/dashboard/cities"
			/>
		</div>
	);
}
