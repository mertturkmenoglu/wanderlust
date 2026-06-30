import { createFileRoute, Link } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import z from 'zod';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
import { Pagination } from '@/components/pagination';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { orpc } from '@/lib/orpc';

const schema = z.object({
	page: z.number().min(1).max(100).default(1).catch(1),
	pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
	resourceType: z.string().optional().catch(''),
	reason: z.number().optional().catch(1),
	reporterId: z.string().optional().catch(''),
	resolved: z.boolean().optional().catch(false),
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

export const Route = createFileRoute('/dashboard/reports/')({
	component: RouteComponent,
	validateSearch: schema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps, context }) => {
		return context.queryClient.ensureQueryData(
			orpc.reports.search.queryOptions({
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
	staticData: {
		breadcrumb: 'Reports',
	},
});

function RouteComponent() {
	const crumbs = useBreadcrumbs();
	const { reports, pagination } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	return (
		<Container>
			<Breadcrumbs crumbs={crumbs} />

			<Separator className="my-4" />

			<DenseList
				data={reports}
				keyExtractor={(r) => r.id}
				renderItem={(item, className) => (
					<Link to="/dashboard/reports/$id" params={{ id: item.id }}>
						<div className={cn('flex gap-4', className)}>
							<div>ID: {item.id}</div>
							<div>Type: {item.resourceType}</div>
							<div>Reason: {getReason(item.reason)}</div>
							<div>Resolved: {item.resolved ? 'Yes' : 'No'}</div>
							<div className="ml-auto text-muted-foreground">
								Created:{' '}
								{formatDistanceToNow(item.createdAt, {
									addSuffix: true,
								})}
							</div>
						</div>
					</Link>
				)}
			/>

			<Pagination
				className="mx-auto my-4"
				hasNextPage={pagination.hasNext}
				hasPreviousPage={pagination.hasPrevious}
				page={pagination.page}
				totalPages={pagination.totalPages}
				onNextClick={() =>
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: Math.min(pagination.page + 1, pagination.totalPages),
						}),
					})
				}
				onPrevClick={() =>
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: Math.max(pagination.page - 1, 1),
						}),
					})
				}
			/>
		</Container>
	);
}
