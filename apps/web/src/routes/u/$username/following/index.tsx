import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { z } from 'zod';
import { Pagination } from '@/components/pagination';
import { EmptyState } from './-empty';
import { FollowingItem } from './-item';

const schema = z.object({
	page: z.transform(Number).pipe(z.number()).optional(),
});

export const Route = createFileRoute('/u/$username/following/')({
	component: RouteComponent,
	validateSearch: schema,
	loaderDeps: ({ search }) => ({
		page: search.page ?? 1,
	}),
	loader: ({ context, params, deps }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.users.listFollowing.queryOptions({
				input: {
					username: params.username,
					page: deps.page,
					pageSize: 20,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { following, pagination } = Route.useLoaderData();
	const navigate = useNavigate();

	if (following.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="my-8">
			<ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{following.map((following) => (
					<FollowingItem key={following.id} following={following} />
				))}
			</ItemGroup>
			<Pagination
				className="mx-auto my-4"
				hasNextPage={pagination.hasNext}
				hasPreviousPage={pagination.hasPrevious}
				page={pagination.page}
				totalPages={pagination.totalPages}
				onPrevClick={() =>
					navigate({
						to: '.',
						search: {
							page: pagination.page - 1,
						},
					})
				}
				onNextClick={() =>
					navigate({
						to: '.',
						search: {
							page: pagination.page + 1,
						},
					})
				}
			/>
		</div>
	);
}
