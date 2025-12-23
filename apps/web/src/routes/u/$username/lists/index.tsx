import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import React from 'react';
import { AppMessage } from '@/components/app-message';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/u/$username/lists/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { username } = Route.useParams();
	const query = useInfiniteQuery(
		orpc.lists.listPublic.infiniteOptions({
			input: (page) => ({
				username,
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasNext
					? lastPage.pagination.page + 1
					: null;
			},
			retry: false,
			enabled: username !== '',
		}),
	);

	return (
		<div>
			{query.isLoading && (
				<AppMessage
					emptyMessage="Loading..."
					showBackButton={false}
					className="my-16"
				/>
			)}
			{query.data && query.data.pages[0]?.lists.length === 0 && (
				<AppMessage
					emptyMessage="No lists yet"
					showBackButton={false}
					className="my-16"
				/>
			)}
			{query.data && (
				<div className="grid grid-cols-1 gap-2">
					{query.data.pages.map((page, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: TODO
						<React.Fragment key={i}>
							{page.lists.map((list) => (
								<Link
									to="/lists/$id"
									params={{
										id: list.id,
									}}
									key={list.id}
									className="block rounded-lg p-2 transition-colors hover:bg-primary/5"
								>
									<div className="flex items-center gap-4">
										<div>
											<div className="text-primary hover:underline">
												{list.name}
											</div>
											<div className="text-muted-foreground text-sm">
												Created at:{' '}
												{new Date(list.createdAt).toLocaleDateString()}
											</div>
										</div>
									</div>
								</Link>
							))}
						</React.Fragment>
					))}
				</div>
			)}

			{query.hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						onClick={() => query.fetchNextPage()}
						disabled={!query.hasNextPage || query.isFetchingNextPage}
					>
						{query.isFetchingNextPage
							? 'Loading more...'
							: query.hasNextPage
								? 'Load More'
								: 'Nothing more to load'}
					</Button>
				</div>
			)}
		</div>
	);
}
