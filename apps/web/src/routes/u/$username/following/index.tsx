import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { z } from 'zod';
import { EmptyState } from './-components/empty';
import { FollowingItem } from './-components/item';

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

	return (
		<div className="my-8">
			{following.length === 0 && <EmptyState />}

			{following.length > 0 && (
				<>
					<ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{following.map((following) => (
							<FollowingItem key={following.id} following={following} />
						))}
					</ItemGroup>
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
				</>
			)}
		</div>
	);
}
