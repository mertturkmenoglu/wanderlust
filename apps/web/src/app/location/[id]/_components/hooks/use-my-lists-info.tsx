import { api, rpc } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

export function useMyListsInfo(locationId: string) {
  const { isSignedIn } = useAuth();

  const query = useQuery({
    queryKey: ['my-lists-info', locationId],
    queryFn: async () => {
      const res = await rpc(() =>
        api.lists.info[':locationId'].$get({
          param: {
            locationId,
          },
        })
      );
      return res.data;
    },
    enabled: isSignedIn,
  });

  return query;
}
