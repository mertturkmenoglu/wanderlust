'use client';

import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

type Props = {
  listId: string;
};

async function getListItems(listId: string, page: number) {
  return rpc(() => {
    return api.lists[':id'].items.$get({
      param: {
        id: listId,
      },
      query: {
        page: `${page}`,
      },
    });
  });
}

export default function Items({ listId }: Props) {
  const query = useInfiniteQuery({
    queryKey: ['list', 'items', listId],
    queryFn: ({ pageParam }) => getListItems(listId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  return (
    <div>
      {query.data && (
        <div>
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((loc) => (
                <pre key={loc.locationId}>{JSON.stringify(loc, null, 2)}</pre>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
