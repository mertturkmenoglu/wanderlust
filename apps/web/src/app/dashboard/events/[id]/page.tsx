'use client';

import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Props) {
  const query = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      return rpc(() =>
        api.events[':id'].$get({
          param: {
            id,
          },
        })
      );
    },
  });

  return (
    <div>
      <div>Event with id: {id}</div>
      <pre className=" text-wrap">
        {JSON.stringify(query.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}
