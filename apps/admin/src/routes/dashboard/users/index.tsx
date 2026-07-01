import { queryOptions } from '@tanstack/react-query';
import { createFileRoute, Link, linkOptions } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import z from 'zod';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
import { DefaultPagination } from '@/components/pagination/default-pagination';
import { authClient } from '@/lib/auth';
import { defineStaticData } from '@/lib/define-static-data';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

const searchSchema = defaultSearchSchema.extend({
	searchBy: z.enum(['email', 'name']).optional().catch('email'),
});

const options = (search: z.infer<typeof searchSchema>) =>
	queryOptions({
		queryKey: ['users', search],
		queryFn: async () => {
			const result = await authClient.admin.listUsers({
				query: {
					limit: search.pageSize ?? 20,
					offset: ((search.page ?? 1) - 1) * (search.pageSize ?? 20),
					sortBy: 'name',
					sortDirection: 'asc',
					searchValue: search.search,
					searchField: search.searchBy,
					searchOperator: 'contains',
				},
			});

			if (result.error) {
				throw new Error(result.error.message);
			}

			return result.data;
		},
	});

const link = (id: string) =>
	linkOptions({
		to: '/dashboard/users/$id',
		params: { id },
	});

const staticData = defineStaticData({
	breadcrumb: 'Users',
});

export const Route = createFileRoute('/dashboard/users/')({
	component: RouteComponent,
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context, deps }) => {
		return context.queryClient.ensureQueryData(options(deps.search));
	},
	staticData,
});

function RouteComponent() {
	const { users, total } = Route.useLoaderData();
	const search = Route.useSearch();
	const hasNext = (search.page ?? 1) * (search.pageSize ?? 20) < total;

	return (
		<Container>
			<DenseList
				data={users}
				keyExtractor={(u) => u.id}
				className="my-4"
				renderItem={(item, className) => (
					<Link {...link(item.id)}>
						<div className={cn('flex gap-2', className)}>
							<div>{item.name}</div>
							<div className="ml-4 text-muted-foreground text-sm">
								{/* @ts-expect-error username is included in the data */}@
								{item.username}
							</div>
						</div>
					</Link>
				)}
			/>

			<DefaultPagination
				pagination={{
					hasNext,
					hasPrevious: search.page ? search.page > 1 : false,
					page: search.page ?? 1,
					pageSize: search.pageSize ?? 20,
					totalPages: Math.ceil(total / (search.pageSize ?? 20)),
					totalRecords: total,
				}}
			/>
		</Container>
	);
}
