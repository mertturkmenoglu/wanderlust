import { AppMessage } from '@/components/blocks/app-message';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';
import { useBookmarksQuery } from './-hooks';
import { Spinner } from '@/components/ui/spinner';
import { Navigation } from './-navigation';
import { ItemGroup } from '@/components/ui/item';
import { useEffect } from 'react';
import { PlaceCard } from '@/components/blocks/place-card';
import { BookmarksContextProvider, useBookmarksContext } from './-context';
import { BookmarkItem } from './-item';
import { Actions } from './-actions';
import { BookmarkItemMap } from './-map';

const bookmarksSearchSchema = z.object({
  page: z.number().min(1).max(100).default(1).catch(1),
  pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});

export const Route = createFileRoute('/bookmarks/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
  validateSearch: bookmarksSearchSchema,
});

function RouteComponent() {
  return (
    <BookmarksContextProvider>
      <div className="max-w-7xl mx-auto my-8">
        <h2 className="text-2xl">Your Bookmarks</h2>
        <SuspenseWrapper>
          <div className="my-4">
            <Bookmarks />
          </div>
        </SuspenseWrapper>
      </div>
    </BookmarksContextProvider>
  );
}

function Bookmarks() {
  const { page } = Route.useSearch();
  const query = useBookmarksQuery();
  const ctx = useBookmarksContext();

  useEffect(() => {
    ctx.setIndex(0);
  }, [page]);

  if (query.error) {
    return (
      <AppMessage
        errorMessage={query.error.title ?? 'Something went wrong'}
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    if (query.data.bookmarks.length === 0) {
      return (
        <AppMessage
          emptyMessage="You have no bookmarks."
          showBackButton={false}
        />
      );
    }

    const { bookmarks, pagination } = query.data;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        <ItemGroup className="gap-2">
          {bookmarks.map((bookmark, i) => (
            <BookmarkItem
              key={bookmark.placeId}
              bookmark={bookmark}
              itemIndex={i}
            />
          ))}

          <div className="mt-4 flex justify-center col-span-full">
            <Navigation
              totalPages={pagination.totalPages}
              hasPrevious={pagination.hasPrevious}
              hasNext={pagination.hasNext}
            />
          </div>
        </ItemGroup>

        <div className="hidden md:block">
          <PlaceCard
            place={bookmarks[ctx.index]!.place}
            hoverEffects={false}
          />

          <Actions bookmark={bookmarks[ctx.index]!} />

          <BookmarkItemMap bookmark={bookmarks[ctx.index]!} />
        </div>
      </div>
    );
  }

  return <Spinner className="text-primary mx-auto my-16 size-12" />;
}
