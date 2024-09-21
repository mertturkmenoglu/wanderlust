'use client';

import api from '@/lib/api';
import { PeekPoisResponseDto } from '@/lib/dto';
import { useQuery } from '@tanstack/react-query';
import { poisCols } from '../_components/columns';
import { DataTable } from '../_components/data-table';

export default function Page() {
  const query = useQuery({
    queryKey: ['pois-peek'],
    queryFn: async () =>
      api.get('pois/peek').json<{ data: PeekPoisResponseDto }>(),
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">
        Point of Interests
      </h3>
      {query.data?.data && (
        <DataTable
          columns={poisCols}
          data={query.data.data.pois.map((poi) => ({
            id: poi.id,
            name: poi.name,
            addressId: poi.addressId,
            categoryId: poi.categoryId,
          }))}
          hrefPrefix="/dashboard/pois"
        />
      )}
    </div>
  );
}
