import { createFileRoute, Link } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { reportsCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';

const schema = z.object({
	page: z.coerce.number().catch(1),
	pageSize: z.coerce.number().multipleOf(10).catch(10),
	resourceType: z.string().catch(''),
	reason: z.coerce.number().catch(0),
	reporterId: z.string().catch(''),
	resolved: z.boolean().catch(false),
});

const reasons = [
	{
		id: 1,
		name: 'Spam',
	},
	{
		id: 2,
		name: 'Inappropriate',
	},
	{
		id: 3,
		name: 'Fake',
	},
	{
		id: 4,
		name: 'Other',
	},
];

function getReason(r: number) {
	return reasons.find((x) => x.id === r)?.name ?? 'Other';
}

export const Route = createFileRoute('/_admin/dashboard/reports/')({
	component: RouteComponent,
	validateSearch: schema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps, context }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.reports.search.queryOptions({
				input: {
					page: deps.search.page,
					pageSize: deps.search.pageSize,
					resourceType: deps.search.resourceType || undefined,
					reason: deps.search.reason || undefined,
					reporterId: deps.search.reporterId || undefined,
					resolved: deps.search.resolved || undefined,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { reports, pagination } = Route.useLoaderData();

	return (
		<div>
			<DashboardBreadcrumb
				items={[{ name: 'Reports', href: '/dashboard/reports' }]}
			/>

			<Separator className="my-4" />

			<div>
				<DataTable
					columns={reportsCols}
					filterColumnId="description"
					data={reports.map((r) => ({
						id: r.id,
						resourceId: r.resourceId,
						resourceType: r.resourceType,
						reporterId: r.reporterId,
						description:
							(r.description?.length ?? 0) > 10
								? `${r.description?.slice(0, 10)}...`
								: r.description,
						reason: getReason(r.reason),
						resolved: r.resolved ? 'Yes' : 'No',
						resolvedAt:
							r.resolvedAt === null
								? '-'
								: `${formatDistanceToNow(new Date(r.resolvedAt))} ago`,
						createdAt: `${formatDistanceToNow(new Date(r.createdAt))} ago`,
						updatedAt: `${formatDistanceToNow(new Date(r.updatedAt))} ago`,
					}))}
					hrefPrefix="/dashboard/reports"
				/>
				<div className="mt-4 flex items-center justify-between gap-4">
					<div className="text-muted-foreground text-sm">
						Showing {reports.length} of {pagination.totalRecords} reports
					</div>

					<div className="flex items-center gap-2 text-sm">
						<Link
							to="."
							search={(prev) => {
								let page = 1;

								if (prev.page) {
									page = prev.page === 1 ? 1 : prev.page - 1;
								}

								return {
									...prev,
									page,
								};
							}}
							className={cn('flex items-center gap-2', {
								'cursor-not-allowed opacity-50': !pagination.hasPrevious,
							})}
						>
							<ChevronLeftIcon className="size-4" />
							Previous
						</Link>

						<Link
							to="."
							search={(prev) => {
								let page = 1;

								if (prev.page) {
									page =
										prev.page === pagination.totalPages
											? prev.page
											: prev.page + 1;
								}

								return {
									...prev,
									page,
								};
							}}
							className={cn('flex items-center gap-2', {
								'cursor-not-allowed opacity-50': !pagination.hasNext,
							})}
						>
							Next
							<ChevronRightIcon className="size-4" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
