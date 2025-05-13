import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

type TStep = 1 | 2 | 3 | 4 | 5;
type Draft = components['schemas']['GetPoiDraftOutputBody']['draft'];

export function useUpdateDraftMutation(draft: Draft, step: TStep) {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();

  return api.useMutation('patch', '/api/v2/pois/drafts/{id}', {
    onSuccess: async () => {
      toast.success('Draft updated');
      await router.invalidate();
      await qc.invalidateQueries();
      await qc.refetchQueries();

      navigate({
        to: '/dashboard/pois/drafts/$id',
        params: {
          id: (draft.id as string | null | undefined) ?? '',
        },
        search: {
          step: step + 1,
        },
      });
    },
  });
}
