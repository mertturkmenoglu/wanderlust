import AppMessage from '@/components/blocks/app-message';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ipx } from '@/lib/ipx';
import { type Props as THit } from '@/routes/search/-components/hit';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';

type SearchResponse = {
  found: number;
  hits: Array<{
    document: THit['hit'];
  }>;
  out_of: number;
  page: number;
};

export default function NearbyPois() {
  const route = getRouteApi('/p/$id/');
  const {
    poi: {
      id,
      address: { lat, lng },
    },
  } = route.useLoaderData();
  const searchApiKey = import.meta.env.VITE_SEARCH_CLIENT_API_KEY ?? '';
  const searchApiUrl = import.meta.env.VITE_SEARCH_CLIENT_URL ?? '';

  const query = useQuery({
    queryKey: ['poi-nearby', id],
    queryFn: async () => {
      const sp = new URLSearchParams();
      sp.append('q', '*');
      sp.append('query_by', 'name');
      sp.append('filter_by', `location:(${lat},${lng},50 km)`);
      const qs = sp.toString();
      const res = await fetch(
        `${searchApiUrl}/collections/pois/documents/search?${qs}`,
        {
          headers: {
            'X-TYPESENSE-API-KEY': searchApiKey,
          },
        },
      );
      const data = (await res.json()) as SearchResponse;
      return data;
    },
  });

  console.log({ abc: query.data?.hits });

  if (query.data) {
    return (
      <div className="mt-4 lg:px-8">
        <h3 className="text-2xl font-bold tracking-tight">Nearby Locations</h3>
        <ScrollArea>
          <div className="flex gap-8 my-4">
            {query.data.hits.slice(0, 6).map(({ document: p }) => (
              <Link
                to="/p/$id"
                params={{
                  id: p.poi.id,
                }}
                key={p.poi.id}
              >
                <div className="group w-[256px]">
                  <img
                    src={ipx(p.poi.media[0]?.url ?? '', 'w_512')}
                    alt=""
                    className="aspect-video w-full rounded-md object-cover"
                  />

                  <div className="my-2">
                    <div className="mt-2 line-clamp-1 text-lg font-semibold capitalize">
                      {p.name}
                    </div>
                    <div className="line-clamp-1 text-sm text-muted-foreground">
                      {p.poi.address.city.name} /{' '}
                      {p.poi.address.city.country.name}
                    </div>
                  </div>

                  <div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-primary">
                        {p.poi.category.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="mt-8" />
        </ScrollArea>
      </div>
    );
  }

  if (query.error) {
    return (
      <AppMessage errorMessage="Something went wrong" showBackButton={false} />
    );
  }

  return (
    <div>
      <LoaderCircleIcon className="size-12 text-primary mx-auto animate-spin" />
    </div>
  );
}
