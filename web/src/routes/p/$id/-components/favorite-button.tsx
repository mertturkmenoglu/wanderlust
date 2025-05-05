import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export default function FavoriteButton() {
  const route = getRouteApi('/p/$id/');
  const { poi, meta } = route.useLoaderData();
  const [fav, setFav] = useState(meta.isFavorite);
  const auth = useContext(AuthContext);

  const createMutation = api.useMutation('post', '/api/v2/favorites/', {
    onSuccess: () => {
      setFav((prev) => !prev);
      toast.success('Added to favorites');
    },
    onError: () => {
      toast.error('Failed to add to favorites');
    },
  });

  const deleteMutation = api.useMutation('delete', '/api/v2/favorites/{id}', {
    onSuccess: () => {
      setFav((prev) => !prev);
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove from favorites');
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => {
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
            }}
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
