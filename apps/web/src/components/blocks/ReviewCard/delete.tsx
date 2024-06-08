import { api, rpc } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = {
  locationId: string;
};

export function useDeleteReview({ locationId }: Props) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: async (id: string) => {
      await rpc(() =>
        api.reviews[':id'].$delete({
          param: {
            id,
          },
        })
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ['reviews', locationId],
      });

      toast.success('Review deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });
}
