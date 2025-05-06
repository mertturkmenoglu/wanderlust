import type { components } from '@/lib/api-types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

type TStep = 1 | 2 | 3 | 4 | 5;
type Draft = components['schemas']['GetPoiDraftOutputBody']['draft'];

export function useUpdateDraftMutation<TForm>(draft: Draft, step: TStep) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['poi-draft', draft.id, 'step', step],
    mutationFn: async (data: TForm) => {
      // updateDraft(draft.id, {
      //   ...draft,
      //   ...data,
      // }),
      console.log(data);
    },
    onSuccess: () => {
      toast.success('Draft updated');
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
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
