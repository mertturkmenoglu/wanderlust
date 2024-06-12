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
    queryKey: ['reports', id],
    queryFn: async () => {
      return rpc(() =>
        api.reports[':id'].$get({
          param: {
            id,
          },
        })
      );
    },
  });

  return (
    <div>
      <div>Report with id: {id}</div>
      <pre>{JSON.stringify(query.data ?? {}, null, 2)}</pre>
    </div>
  );
}
