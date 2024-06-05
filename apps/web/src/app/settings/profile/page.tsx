'use client';

import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import ProfileForm from './_components/form';

export default function Page() {
  const query = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await rpc(() => api.users.me.$get());
      return res.data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight first:mt-0">
        Profile
      </h2>

      {query.data && <ProfileForm initialData={query.data} />}
    </div>
  );
}
