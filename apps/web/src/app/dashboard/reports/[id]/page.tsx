'use client';

import AppMessage from '@/components/blocks/AppMessage';
import { api, rpc } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import ReportForm from './_components/form';
import Loading from './_components/loading';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Props) {
  const query = useQuery({
    queryKey: ['reports', id],
    queryFn: async () => {
      const res = await rpc(() =>
        api.reports[':id'].$get({
          param: {
            id,
          },
        })
      );

      return res.data;
    },
  });

  const { user } = useUser();

  if (query.isPending || !user) {
    return <Loading />;
  }

  if (query.isError) {
    return (
      <AppMessage
        errorMessage={query.error?.message ?? ''}
        showBackButton={false}
      />
    );
  }

  return (
    <div>
      <ReportForm
        report={query.data}
        username={user.username ?? ''}
      />
    </div>
  );
}
