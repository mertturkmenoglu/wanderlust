import { Button } from '@/components/ui/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { createFileRoute, redirect } from '@tanstack/react-router';
import React from 'react';
import { Header } from './-components/header';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from './-components/empty';
import { useListsQuery } from './-hooks';
import { ListItem } from './-components/item';

export const Route = createFileRoute('/lists/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
});

function RouteComponent() {
  const query = useListsQuery();

  const btnText = useLoadMoreText({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  const isEmpty = query.data && query.data.pages[0]?.lists.length === 0;

  return (
    <div className="max-w-7xl my-8 mx-auto">
      <Header showNewListButton={!isEmpty} />

      {query.isLoading && (
        <Spinner className="mx-auto my-16 text-primary size-12" />
      )}

      {isEmpty && <EmptyState />}

      {query.data && (
        <div className="grid grid-cols-1 gap-2 mt-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.lists.map((list) => (
                <ListItem
                  key={list.id}
                  list={list}
                />
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
