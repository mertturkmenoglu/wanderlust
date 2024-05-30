'use client';

import { api, rpc } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import BookmarkCard from './_components/bookmark-card';

export default function Page() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(searchParams.get('page') ?? '1');

  const query = useQuery({
    queryKey: ['bookmarks', page],
    queryFn: async () => {
      return rpc(() =>
        api.bookmarks.$get({
          query: {
            page,
          },
        })
      );
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="mt-8">
      {query.data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {query.data.map((bookmark) => (
            <Link
              href={`/location/${bookmark.locationId}`}
              key={bookmark.locationId}
              className="block"
            >
              <BookmarkCard bookmark={bookmark} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
