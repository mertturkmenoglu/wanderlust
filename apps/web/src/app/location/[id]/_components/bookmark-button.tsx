'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api, rpc } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    onSuccess: async () => {
      const prev = booked;
      setBooked((prev) => !prev);
      await qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(prev ? 'Bookmark removed' : 'Bookmark added');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{booked ? 'Remove bookmark' : 'Add to bookmarks'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
