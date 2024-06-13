import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return rpc(() => api.categories.$get());
    },
    staleTime: 10 * 60 * 1000,
  });
}
