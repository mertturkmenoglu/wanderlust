import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_admin/dashboard/categories/')({
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

			<DashboardActions>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link to="/dashboard/categories/new">
						<Item variant="outline" className="max-w-sm hover:bg-muted">
							<ItemMedia variant="icon">
								<PlusIcon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>New Category</ItemTitle>
							</ItemContent>
						</Item>
					</Link>
				</div>
			</DashboardActions>

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
