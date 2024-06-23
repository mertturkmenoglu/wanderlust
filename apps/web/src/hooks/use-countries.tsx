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
