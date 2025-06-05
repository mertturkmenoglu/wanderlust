import AppMessage from '@/components/blocks/app-message';
import PoiCard from '@/components/blocks/poi-card';
import Spinner from '@/components/kit/spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  className?: string;
};

export function Collections({ className }: Props) {
  return (
    <ErrorBoundary
      fallback={<AppMessage errorMessage="Something went wrong" />}
    >
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Spinner className="size-12 mx-auto my-4" />
          </div>
        }
      >
        <Content className={className} />
      </Suspense>
    </ErrorBoundary>
  );
}

type ContentProps = {
  className?: string;
};

function Content({ className }: ContentProps) {
  const route = getRouteApi('/p/$id/');
  const { id } = route.useParams();
  const query = api.useSuspenseQuery('get', '/api/v2/collections/poi/{id}', {
    params: {
      path: {
        id: id,
      },
    },
  });

  return (
    <div className={cn(className)}>
      <div className="mt-8 space-y-8">
        {query.data.collections.map((collection) => (
          <div key={collection.id}>
            <div
              key={collection.id}
              className="flex items-baseline gap-4 mb-4"
            >
              <h3 className="text-2xl font-bold">{collection.name}</h3>
              <Link
                to="/c/$id"
                params={{
                  id: collection.id,
                }}
                className="hover:underline decoration-primary decoration-2 underline-offset-4 text-base text-primary"
              >
                See more
              </Link>
            </div>

            <ScrollArea>
              <div className="flex gap-8 my-4">
                {collection.items.map((item) => (
                  <Link
                    key={item.poiId}
                    to="/p/$id"
                    params={{
                      id: item.poiId,
                    }}
                  >
                    <PoiCard
                      poi={item.poi}
                      className="w-[256px]"
                      hoverEffects={false}
                    />
                  </Link>
                ))}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="mt-8"
              />
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
