'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = {
  listId: string;
};

export default function DeleteButton({ listId }: Props) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-list'],
    mutationFn: async (id: string) => {
      await rpc(() =>
        api.lists[':id'].$delete({
          param: {
            id,
          },
        })
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ['lists'],
      });

      toast.success('List deleted successfully');
      window.location.href = '/lists';
    },
    onError: () => {
      toast.error('Failed to delete list');
    },
  });
  return (
    <Button
      type="submit"
      variant="destructive"
      onClick={() => mutation.mutate(listId)}
    >
      Delete
    </Button>
  );
}
