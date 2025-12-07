/** biome-ignore-all lint/suspicious/noArrayIndexKey: TODO */
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Spinner } from '@wanderlust/ui/components/spinner';
import React from 'react';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { authGuard } from '@/lib/auth';
import { EmptyState } from './-components/empty';
import { Header } from './-components/header';
import { ListItem } from './-components/item';
import { useListsQuery } from './-hooks';

export const Route = createFileRoute('/lists/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	const query = useListsQuery();

	const btnText = useLoadMoreText({
		hasNextPage: query.hasNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
	});

	const isEmpty = query.data && query.data.pages[0]?.lists.length === 0;

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<Header showNewListButton={!isEmpty} />

			{query.isLoading && (
				<Spinner className="mx-auto my-16 size-12 text-primary" />
			)}

			{isEmpty && <EmptyState />}

			{query.data && (
				<div className="mt-4 grid grid-cols-1 gap-2">
					{query.data.pages.map((page, i) => (
						<React.Fragment key={i}>
							{page.lists.map((list) => (
								<ListItem key={list.id} list={list} />
							))}
						</React.Fragment>
					))}
				</div>
			)}

			{query.hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						variant="secondary"
						onClick={() => query.fetchNextPage()}
						disabled={!query.hasNextPage || query.isFetchingNextPage}
					>
						{btnText}
					</Button>
				</div>
			)}
		</div>
	);
}
