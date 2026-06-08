import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { keyValueCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';

export const Route = createFileRoute('/dashboard/categories/')({
	component: RouteComponent,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.categories.list.queryOptions({
				input: {},
			}),
		),
});

function RouteComponent() {
	const { categories } = Route.useLoaderData();

	return (
		<>
			<DashboardBreadcrumb
				items={[{ name: 'Categories', href: '/dashboard/categories' }]}
			/>

			<Separator className="my-4" />

			<DataTable
				columns={keyValueCols}
				filterColumnId="v"
				data={categories.map((c) => ({
					k: `${c.id}`,
					v: c.name,
				}))}
				hrefPrefix="/dashboard/categories"
				hrefColumnId="k"
			/>
		</>
	);
}
