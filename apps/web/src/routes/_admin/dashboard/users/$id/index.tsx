import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { authClient } from '@/lib/auth';
import { DangerousActions } from './-dangerous';
import { Table } from './-table';

export const Route = createFileRoute('/_admin/dashboard/users/$id/')({
	component: RouteComponent,
	loader: ({ params }) => {
		return authClient.admin.getUser({
			query: { id: params.id },
		});
	},
});

function RouteComponent() {
	const query = Route.useLoaderData();

	if (!query.data) {
		return null;
	}

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Users', href: '/dashboard/users' },
					{
						name: query.data.name,
						href: `/dashboard/users/${query.data.id}`,
					},
				]}
			/>

			<Separator className="my-4" />

			<Table />

			<DangerousActions className="mt-8" />
		</>
	);
}
