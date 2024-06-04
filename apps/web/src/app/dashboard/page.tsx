'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { eventCols, locationsCols } from './_components/columns';
import { DataTable } from './_components/data-table';

function Page() {
  const qLocations = useQuery({
    queryKey: ['locations'],
    queryFn: async () => rpc(() => api.locations.peek.$get()),
  });

  const qEvents = useQuery({
    queryKey: ['events'],
    queryFn: async () => rpc(() => api.events.peek.$get()),
  });

  return (
    <div>
      <div>
        <h3 className="my-4 text-lg font-bold tracking-tight">Locations</h3>
        {qLocations.data?.data && (
          <DataTable
            columns={locationsCols}
            data={qLocations.data.data.map((loc) => ({
              ...loc,
              category: loc.category.name,
              city: loc.address.city,
              state: loc.address.state ?? '-',
              country: loc.address.country,
            }))}
          />
        )}
        <Button asChild>
          <Link
            href="/dashboard/locations/new"
            className="mt-4 block"
          >
            Create new location
          </Link>
        </Button>
      </div>

      <div className="mt-16">
        <h3 className="my-4 text-lg font-bold tracking-tight">Events</h3>
        <DataTable
          columns={eventCols}
          data={qEvents.data?.data ?? []}
        />
        <Link
          href="/dashboard/events/new"
          className="mt-4 block"
        >
          Create new event
        </Link>
      </div>
    </div>
  );
}

export default Page;
