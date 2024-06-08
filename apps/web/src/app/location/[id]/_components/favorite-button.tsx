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
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  isFavorite: boolean;
  locationId: string;
};

export default function FavoriteButton({ isFavorite, locationId }: Props) {
  const [fav, setFav] = useState(isFavorite);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['favorites', locationId],
    mutationFn: async () => {
      if (fav) {
        return api.favorites[':id'].$delete({
          param: {
            id: locationId,
          },
        });
      }

      return rpc(() =>
        api.favorites.$post({
          json: {
            locationId,
          },
        })
      );
    },
    onSuccess: async () => {
      const prev = fav;
      setFav((prev) => !prev);
      await qc.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(prev ? 'Removed from favorites' : 'Added to favorites');
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
            <Heart
              className={cn('size-6 text-primary', {
                'fill-primary': fav,
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{fav ? 'Remove favorite' : 'Add to favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
