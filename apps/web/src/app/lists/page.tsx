'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Loading from './loading';

async function getLists() {
  const res = await rpc(() => api.lists.my.$get());
  return res.data;
}

export default function Page() {
  const query = useQuery({
    queryKey: ['lists'],
    queryFn: () => getLists(),
  });

  if (query.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Lists</h2>
        <Button
          asChild
          size="sm"
          variant="default"
        >
          <Link href="/lists/new">
            <span>New List</span>
            <Plus className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      <hr className="my-2" />
      <div className="mt-8">
        {query.data && (
          <div className="grid grid-cols-1 gap-4">
            {query.data.map((list) => (
              <Link
                href={`/lists/${list.id}`}
                key={list.id}
                className="block"
              >
                {list.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
