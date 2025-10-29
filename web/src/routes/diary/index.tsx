import { AppMessage } from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Header } from './-components/header';
import { DiaryContextProvider } from './-context';
import { useDiaryContext, useDiaryEntriesQuery } from './-hooks';
import { Spinner } from '@/components/ui/spinner';
import { ItemGroup } from '@/components/ui/item';
import { EntryItem } from './-components/item';

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
      <div className="max-w-7xl mx-auto my-8 space-y-4">
        <Header />

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

  if (isEmpty) {
    return (
      <AppMessage
        emptyMessage="You have no entries yet"
        showBackButton={false}
      />
    );
  }

  if (query.isError) {
    return (
      <AppMessage
        errorMessage="Error loading diary entries"
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    const { pages } = query.data;
    const entries = pages.flatMap((page) => page.diaries);

    return (
      <div>
        <ItemGroup className="gap-2">
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
            />
          ))}
        </ItemGroup>

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

  return <Spinner className="mx-auto my-8 text-primary size-12" />;
}
