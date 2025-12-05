import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftRightIcon, PlusIcon } from 'lucide-react';
import { DashboardActionItem } from '@/components/blocks/dashboard/action-item';
import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { collectionsCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_admin/dashboard/collections/')({
	component: RouteComponent,
	loader: ({ context }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.collections.list.queryOptions({
				input: {
					page: 1,
					pageSize: 50,
				},
			}),
		);
	},
});

function shortDescription(str: string) {
	if (str.length > 64) {
		return `${str.slice(0, 64)}...`;
	}

	return str;
}

function RouteComponent() {
	const { collections } = Route.useLoaderData();
	return (
		<div>
			<DashboardBreadcrumb
				items={[{ name: 'Collections', href: '/dashboard/collections' }]}
			/>

			<Separator className="my-2" />

			<DashboardActions>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link to="/dashboard/collections/new">
						<DashboardActionItem icon={PlusIcon} text="New Collection" />
					</Link>

					<Link to="/dashboard/collections/relations">
						<DashboardActionItem
							icon={ArrowLeftRightIcon}
							text="Place Relations"
						/>
					</Link>

					<Link to="/dashboard/collections/relations">
						<DashboardActionItem
							icon={ArrowLeftRightIcon}
							text="City Relations"
						/>
					</Link>
				</div>
			</DashboardActions>

			<DataTable
				columns={collectionsCols}
				filterColumnId="name"
				data={collections.map((collection) => ({
					id: collection.id,
					name: collection.name,
					description: shortDescription(collection.description),
					createdAt: new Date(collection.createdAt).toLocaleDateString(),
				}))}
				hrefPrefix="/dashboard/collections"
			/>
		</div>
	);
}
