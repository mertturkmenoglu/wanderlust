import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { ArrowLeftRightIcon, PlusIcon } from 'lucide-react';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { collectionsCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DashboardLink } from '@/components/dashboard/link';

export const Route = createFileRoute('/dashboard/collections/')({
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
		<>
			<DashboardBreadcrumb
				items={[{ name: 'Collections', href: '/dashboard/collections' }]}
			/>

			<Separator className="my-2" />

			<DashboardActions>
				<DashboardLink
					to="/dashboard/collections/new"
					icon={PlusIcon}
					title="New Collection"
				/>

				<DashboardLink
					to="/dashboard/collections/relations"
					icon={ArrowLeftRightIcon}
					title="Place Relations"
				/>

				<DashboardLink
					to="/dashboard/collections/relations"
					icon={ArrowLeftRightIcon}
					title="City Relations"
				/>
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
		</>
	);
}
