import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useStates(countryId: number | null) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: async () => {
      const res = await rpc(() =>
        api.locations.states.$get({
          query: {
            countryId: countryId !== null ? `${countryId}` : '-1',
          },
        })
      );
      return res.data;
    },
    enabled: !!countryId,
  });
}
