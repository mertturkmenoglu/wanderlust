import LocationCard from '@/components/blocks/LocationCard';
import { api, rpc } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function peekLocations(type: Props['type']) {
  return rpc(() =>
    api.locations.peek.$get({
      query: {
        type,
      },
    })
  );
}

type Props = {
  type: 'new' | 'popular' | 'featured' | 'favorite';
};

function getTitle(type: Props['type']) {
  switch (type) {
    case 'new':
      return 'New Locations';
    case 'popular':
      return 'Popular Locations';
    case 'featured':
      return 'Featured Locations';
    case 'favorite':
      return 'Favorite Locations';
  }
}

export default async function LocationsGrid({ type }: Props) {
  const { data } = await peekLocations(type);
  const title = getTitle(type);

  return (
    <div className="mx-auto">
      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tighter text-accent-foreground lg:text-3xl">
        {title}
      </h2>

      <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.slice(0, 6).map((location) => (
          <Link
            key={location.id}
            href={`/location/${location.id}`}
          >
            <LocationCard location={location} />
          </Link>
        ))}
      </div>
    </div>
  );
}
