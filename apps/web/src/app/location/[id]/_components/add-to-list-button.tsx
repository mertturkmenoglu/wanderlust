'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = {
  locationId: string;
  listId: string | null;
};

export default function AddToListButton({ locationId, listId }: Props) {
  const mutation = useMutation({
    mutationKey: ['add-to-list'],
    mutationFn: async () => {
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
      toast.success('Added to the list');
    },
    onError: (e) => {
      toast.error(`Cannot add to the list: ${e.message}`);
    },
  });

  return (
    <Button
      type="button"
      variant="default"
      onClick={() => mutation.mutate()}
      disabled={listId === null}
    >
      Add to list
    </Button>
  );
}
