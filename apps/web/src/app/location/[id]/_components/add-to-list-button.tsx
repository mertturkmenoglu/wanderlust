'use client';

import { Button } from '@/components/ui/button';
import { useAddToList } from './hooks/use-add-to-list';

type Props = {
  locationId: string;
  listId: string | null;
};

export default function AddToListButton({ locationId, listId }: Props) {
  const mutation = useAddToList();

  return (
    <Button
      type="button"
      variant="default"
      onClick={() => mutation.mutate({ locationId, listId })}
      disabled={listId === null}
    >
      Add to list
    </Button>
  );
}
