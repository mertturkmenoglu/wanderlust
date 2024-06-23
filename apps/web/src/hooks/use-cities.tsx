import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useCities(countryId: number | null, stateId: number | null) {
  return useQuery({
    queryKey: ['cities', countryId, stateId],
    queryFn: async () => {
      const res = await rpc(() =>
        api.locations.cities.$get({
          query: {
            countryId: countryId !== null ? `${countryId}` : '-1',
            stateId: stateId !== null ? `${stateId}` : '-1',
          },
        })
      );
      return res.data;
    },
    enabled: !!stateId && !!countryId,
  });
}
