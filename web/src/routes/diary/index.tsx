import AppMessage from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import EntryCard from './-components/entry-card';
import Header from './-components/header';
import Loading from './-components/loading';
import { useDiaryEntriesQuery } from './-hooks';

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
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <Header
        date={date}
        setDate={setDate}
      />

      <Separator className="my-4" />

      <Layout date={date} />
    </div>
  );
}

type Props = {
  date: DateRange | undefined;
};

function Layout({ date }: Props) {
  const query = useDiaryEntriesQuery(date);
  const isEmpty = query.data && query.data.pages[0]?.entries.length === 0;
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
              {page.entries.map((entry) => (
                <Link
                  to="/diary/$id"
                  params={{
                    id: entry.id,
                  }}
                  key={entry.id}
                  className="block"
                >
                  <EntryCard entry={entry} />
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
