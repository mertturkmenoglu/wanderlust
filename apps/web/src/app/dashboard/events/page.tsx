'use client';

import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { eventCols } from '../_components/columns';
import { DataTable } from '../_components/data-table';

export default function Page() {
  const query = useQuery({
    queryKey: ['events'],
    queryFn: async () => rpc(() => api.events.peek.$get()),
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">Events</h3>
      {query.data?.data && (
        <DataTable
          columns={eventCols}
          data={query.data?.data ?? []}
        />
      )}
    </div>
  );
}
