// oxlint-disable func-style
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi } from '@tanstack/react-router';
import { HeartIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export function FavoriteButton() {
  const route = getRouteApi('/p/$id/');
  const { poi, meta } = route.useLoaderData();
  const [fav, setFav] = useState(meta.isFavorite);
  const auth = useContext(AuthContext);
  const invalidator = useInvalidator();

  const createMutation = api.useMutation('post', '/api/v2/favorites/', {
    onSuccess: async () => {
      setFav((prev) => !prev);
      await invalidator.invalidate();
      toast.success('Added to favorites');
    },
  });

  const deleteMutation = api.useMutation('delete', '/api/v2/favorites/{id}', {
    onSuccess: async () => {
      setFav((prev) => !prev);
      await invalidator.invalidate();
      toast.success('Removed from favorites');
    },
  });

  const onClick = () => {
    if (!auth.user) {
      toast.warning('You need to be signed in.');
      return;
    }

    if (fav) {
      deleteMutation.mutate({
        params: {
          path: {
            id: poi.id,
          },
        },
      });

      return;
    }

    createMutation.mutate({
      body: {
        poiId: poi.id,
      },
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={onClick}
          >
            <HeartIcon
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
