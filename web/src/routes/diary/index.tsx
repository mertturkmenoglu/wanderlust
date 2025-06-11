import { AppMessage } from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import React from 'react';
import { EntryCard } from './-components/entry-card';
import { Header } from './-components/header';
import { Loading } from './-components/loading';
import { DiaryContextProvider } from './-context';
import { useDiaryContext, useDiaryEntriesQuery } from './-hooks';

export const Route = createFileRoute('/diary/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <DiaryContextProvider>
      <div className="max-w-7xl mx-auto my-8">
        <Header />

        <Separator className="my-4" />

        <Layout />
      </div>
    </DiaryContextProvider>
  );
}

function Layout() {
  const ctx = useDiaryContext();
  const query = useDiaryEntriesQuery(ctx.filterDateRange);
  const isEmpty = query.data && query.data.pages[0]?.diaries.length === 0;
  const loadMoreText = useLoadMoreText(query);

  if (query.isPending) {
    return <Loading />;
  }

  if (isEmpty) {
    return (
      <AppMessage
        emptyMessage="You have no entries yet"
        showBackButton={false}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {query.data &&
          query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.diaries.map((diary) => (
                <Link
                  to="/diary/$id"
                  params={{
                    id: diary.id,
                  }}
                  key={diary.id}
                  className="block"
                >
                  <EntryCard entry={diary} />
                </Link>
              ))}
            </React.Fragment>
          ))}
      </div>

      {query.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => query.fetchNextPage()}
            disabled={!query.hasNextPage || query.isFetchingNextPage}
          >
            {loadMoreText}
          </Button>
        </div>
      )}
    </div>
  );
}
