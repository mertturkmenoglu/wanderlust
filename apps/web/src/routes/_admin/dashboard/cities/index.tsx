import { createFileRoute, Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Separator } from '@wanderlust/ui/components/separator';
import { PlusIcon } from 'lucide-react';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { citiesCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';

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
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link to="/dashboard/cities/new">
						<Item variant="outline" className="max-w-sm hover:bg-muted">
							<ItemMedia variant="icon">
								<PlusIcon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>New City</ItemTitle>
							</ItemContent>
						</Item>
					</Link>
				</div>
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
