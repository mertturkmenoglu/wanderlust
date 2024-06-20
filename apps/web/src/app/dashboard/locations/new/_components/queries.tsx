import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await rpc(() => api.locations.countries.$get());
      return res.data;
    },
  });
}

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
    enabled: !!stateId,
  });
}
