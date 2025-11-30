// oxlint-disable no-nested-ternary

import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { AppMessage } from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { Card } from './-card';

export const Route = createFileRoute('/u/$username/reviews/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { username } = Route.useParams();
	const query = useInfiniteQuery(
		orpc.reviews.listByUsername.infiniteOptions({
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

	const flat = useMemo(() => {
		if (!query.data) {
			return [];
		}

		return query.data.pages.flatMap((p) => p.reviews);
	}, [query.data]);

	return (
		<div>
			{query.isLoading && (
				<AppMessage
					emptyMessage="Loading..."
					showBackButton={false}
					className="my-16"
				/>
			)}

			{query.data && flat.length === 0 && (
				<AppMessage
					emptyMessage="No reviews yet"
					showBackButton={false}
					className="my-16"
				/>
			)}

			{query.data && (
				<div className="grid grid-cols-1 gap-4">
					{flat.map((review, j) => (
						<Card
							key={review.id}
							review={review}
							isLast={j === flat.length - 1}
						/>
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
