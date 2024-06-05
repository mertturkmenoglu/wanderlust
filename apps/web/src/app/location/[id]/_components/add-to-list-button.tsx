'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

type Props = {
  locationId: string;
};

export default function AddToListButton({ locationId }: Props) {
  const mutation = useMutation({
    mutationKey: ['add-to-list'],
    mutationFn: async (id: string) => {},
    onSuccess: async () => {},
    onError: () => {},
  });
  return (
    <Button
      type="button"
      variant="default"
      onClick={() => mutation.mutate(locationId)}
    >
      Add to list
    </Button>
  );
}
