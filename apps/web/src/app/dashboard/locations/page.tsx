'use client';

import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { locationsCols } from '../_components/columns';
import { DataTable } from '../_components/data-table';

export default function Page() {
  const query = useQuery({
    queryKey: ['locations'],
    queryFn: async () => rpc(() => api.locations.peek.$get()),
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">Locations</h3>
      {query.data?.data && (
        <DataTable
          columns={locationsCols}
          data={query.data.data.map((loc) => ({
            ...loc,
            category: loc.category.name,
            city: loc.address.city,
            state: loc.address.state ?? '-',
            country: loc.address.country,
          }))}
          hrefPrefix="/dashboard/locations"
        />
      )}
    </div>
  );
}
