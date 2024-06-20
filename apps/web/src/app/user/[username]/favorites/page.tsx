'use client';

import EmptyContent from '@/components/blocks/EmptyContent';
import LocationCard from '@/components/blocks/LocationCard';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Page() {
  const { username } = useParams();

  const query = useQuery({
    queryKey: ['favorites', username],
    queryFn: async () => {
      if (typeof username !== 'string') {
        throw new Error('Invalid username');
      }

      const res = await rpc(() =>
        api.favorites.user[':username'].$get({
          param: {
            username,
          },
        })
      );

      return res.data;
    },
  });

  if (query.isError) {
    throw new Error('Failed to load lists');
  }

  if (query.isPending) {
    return <></>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      {query.data && query.data.length === 0 && (
        <EmptyContent className="mt-16" />
      )}
      {query.data && query.data.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {query.data.map((favorite) => (
            <Link
              href={`/location/${favorite.locationId}`}
              key={favorite.locationId}
              className=""
            >
              <LocationCard location={favorite.location} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
