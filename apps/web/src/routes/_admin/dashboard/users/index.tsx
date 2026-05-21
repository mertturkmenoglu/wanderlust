import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { authClient } from '@/lib/auth';
import { Content } from './-content';

export const Route = createFileRoute('/_admin/dashboard/users/')({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.number().min(1).max(1_000_000).optional().catch(1),
		pageSize: z.number().min(20).max(100).optional().catch(20),
		search: z.string().optional(),
		searchBy: z.enum(['email', 'name']).optional().catch('email'),
	}),
	loaderDeps: ({ search }) => ({
		page: search.page,
		pageSize: search.pageSize,
		search: search.search,
		searchBy: search.searchBy,
	}),
	loader: ({ deps }) => {
		const page = deps.page ?? 1;
		const pageSize = deps.pageSize ?? 20;

		return authClient.admin.listUsers({
			query: {
				limit: pageSize,
				offset: (page - 1) * pageSize,
				sortBy: 'name',
				sortDirection: 'asc',
				searchValue: deps.search,
				searchField: deps.searchBy,
				searchOperator: 'contains',
			},
		});
	},
});

function RouteComponent() {
	return (
		<>
			<DashboardBreadcrumb
				items={[{ name: 'Users', href: '/dashboard/users' }]}
			/>

			<Separator className="my-4" />

			<Content />
		</>
	);
}
