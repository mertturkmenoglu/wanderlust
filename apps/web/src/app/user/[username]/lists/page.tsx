'use client';

import EmptyContent from '@/components/blocks/EmptyContent';
import ListCard from '@/components/blocks/ListCard';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Page() {
  const { username } = useParams();
  const query = useQuery({
    queryKey: ['lists', username],
    queryFn: async () => {
      if (typeof username !== 'string') {
        throw new Error('Invalid username');
      }

      const res = await rpc(() =>
        api.lists.user[':username'].$get({
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
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4">
          {query.data.map((list) => (
            <Link
              href={`/lists/${list.id}`}
              key={list.id}
              className=""
            >
              <ListCard list={list} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
