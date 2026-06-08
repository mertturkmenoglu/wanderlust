import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { citiesCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';

export const Route = createFileRoute('/dashboard/cities/')({
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

			<DataTable
				columns={citiesCols}
				filterColumnId="name"
				data={cities}
				hrefPrefix="/dashboard/cities"
			/>
		</div>
	);
}
