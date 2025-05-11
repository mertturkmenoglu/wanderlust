import AppMessage from '@/components/blocks/app-message';
import PoiCard from '@/components/blocks/poi-card';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import Markdown from 'react-markdown';

export const Route = createFileRoute('/c/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { collection } = Route.useLoaderData();
  return (
    <div className="max-w-7xl mx-auto mt-8 md:mt-16">
      <h2 className="text-4xl font-bold">{collection.name}</h2>
      <div className="prose mt-8">
        <Markdown>{collection.description}</Markdown>
      </div>
      {collection.items.length === 0 && (
        <AppMessage
          emptyMessage="There are no items in this collection"
          showBackButton={false}
          className="mt-8"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {collection.items.map((item) => (
          <Link
            to="/p/$id"
            params={{
              id: item.poiId,
            }}
            key={item.poiId}
          >
            <PoiCard
              poi={{
                id: item.poiId,
                name: item.poi.name,
                category: item.poi.category,
                address: item.poi.address,
                image: {
                  url: item.poi.media[0]?.url ?? '',
                  alt: item.poi.media[0]?.alt ?? '',
                },
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
