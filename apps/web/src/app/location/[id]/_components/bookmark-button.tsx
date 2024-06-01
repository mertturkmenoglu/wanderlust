'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';

type Props = {
  isBookmarked: boolean;
  locationId: string;
};

export default function BookmarkButton({ isBookmarked, locationId }: Props) {
  const [booked, setBooked] = useState(isBookmarked);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['bookmark', locationId],
    mutationFn: async () => {
      if (booked) {
        return api.bookmarks[':id'].$delete({
          param: {
            id: locationId,
          },
        });
      }

      return rpc(() =>
        api.bookmarks.$post({
          json: {
            locationId,
          },
        })
      );
    },
    onSuccess: () => {
      setBooked((prev) => !prev);
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => mutation.mutate()}
    >
      <BookmarkIcon
        className={cn('size-6 text-primary', {
          'fill-primary': booked,
        })}
      />
    </Button>
  );
}
