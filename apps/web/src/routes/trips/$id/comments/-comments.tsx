import { useInfiniteQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { AppMessage } from '@/components/app-message';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { orpc } from '@/lib/orpc';
import { Item } from './-item';

type Props = {
	className?: string;
};

export function Comments({ className }: Props) {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

	const query = useInfiniteQuery(
		orpc.trips.listComments.infiniteOptions({
			input: (page) => ({
				id: trip.id,
				pageSize: 10,
				page: page,
			}),
			initialPageParam: 1,
			getNextPageParam: (last) =>
				last.pagination.hasNext ? last.pagination.page + 1 : undefined,
			retry: false,
		}),
	);

	const btnText = useLoadMoreText({
		hasNextPage: query.hasNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
	});

	if (query.error) {
		return (
			<AppMessage
				error="Failed to load comments"
				classNames={{ root: 'my-8' }}
			/>
		);
	}

	if (query.isFetching) {
		return <Spinner className="mx-auto my-8 size-8" />;
	}

	if (!query.data) {
		return <AppMessage empty="No comments yet" classNames={{ root: 'my-8' }} />;
	}

	const pages = query.data.pages;
	const isEmpty = pages[0]?.comments.length === 0;
	const flatten = pages.flatMap((p) => p.comments);

	if (isEmpty) {
		return <AppMessage empty="No comments yet" classNames={{ root: 'my-8' }} />;
	}

	return (
		<div className={cn(className)}>
			{flatten.map((comment) => (
				<Item key={comment.id} comment={comment} isPrivileged={isPrivileged} />
			))}

			{query.hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						onClick={() => {
							query.fetchNextPage();
						}}
						disabled={!query.hasNextPage || query.isFetchingNextPage}
					>
						{btnText}
					</Button>
				</div>
			)}
		</div>
	);
}
