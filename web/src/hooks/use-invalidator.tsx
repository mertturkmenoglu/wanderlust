import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

export function useInvalidator() {
  const qc = useQueryClient();
  const router = useRouter();

  return {
    invalidate: async () => {
      await qc.invalidateQueries();
      await qc.refetchQueries();
      await router.invalidate();
    },
  };
}
