import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { z } from 'zod';
import { EmptyState } from './-components/empty';
import { FollowersItem } from './-components/item';

const schema = z.object({
	page: z.transform(Number).pipe(z.number()).optional(),
});

export const Route = createFileRoute('/u/$username/followers/')({
	component: RouteComponent,
	validateSearch: schema,
	loaderDeps: ({ search }) => ({
		page: search.page ?? 1,
	}),
	loader: ({ context, params, deps }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.users.listFollowers.queryOptions({
				input: {
					username: params.username,
					page: deps.page,
					pageSize: 100,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { followers, pagination } = Route.useLoaderData();
	const navigate = useNavigate();

	return (
		<div className="my-8">
			{followers.length === 0 && <EmptyState />}

			{followers.length > 0 && (
				<ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{followers.map((follower) => (
						<FollowersItem key={follower.id} follower={follower} />
					))}
				</ItemGroup>
			)}

			<ButtonGroup className="mx-auto my-4">
				<Button
					variant="outline"
					className="w-32"
					disabled={!pagination.hasPrevious}
					onClick={() =>
						navigate({
							to: '.',
							search: {
								page: pagination.page - 1,
							},
						})
					}
				>
					<ArrowLeftIcon />
					Previous
				</Button>
				<Button variant="secondary" className="w-16">
					{pagination.page} / {pagination.totalPages}
				</Button>
				<Button
					variant="outline"
					className="w-32"
					disabled={!pagination.hasNext}
					onClick={() =>
						navigate({
							to: '.',
							search: {
								page: pagination.page + 1,
							},
						})
					}
				>
					Next
					<ArrowRightIcon />
				</Button>
			</ButtonGroup>
		</div>
	);
}
