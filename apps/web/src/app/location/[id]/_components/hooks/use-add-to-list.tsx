import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Data = {
  locationId: string;
  listId: string | null;
};

export function useAddToList() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['add-to-list'],
    mutationFn: async ({ locationId, listId }: Data) => {
      if (listId === null) {
        throw new Error('Cannot create list');
      }

      const res = await api.lists[':id'].items.$post({
        param: {
          id: listId,
        },
        json: {
          locationId,
        },
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ['my-lists-info'],
      });
      toast.success('Added to the list');
    },
    onError: (e) => {
      toast.error(`Cannot add to the list: ${e.message}`);
    },
  });

  return mutation;
}
