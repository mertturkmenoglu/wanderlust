import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useMyListsInfo(locationId: string) {
  const query = useQuery({
    queryKey: ['my-lists-info'],
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
  });

  return query;
}
