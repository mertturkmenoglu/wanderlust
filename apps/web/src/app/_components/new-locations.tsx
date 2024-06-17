import LocationCard from '@/components/blocks/LocationCard';
import { api, rpc } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function peekLocations() {
  return rpc(() => api.locations.peek.$get());
}

export default async function NewLocations() {
  const { data } = await peekLocations();

  return (
    <div className="mx-auto">
      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tighter text-accent-foreground lg:text-3xl">
        New Locations
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
