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
import { BookmarkIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export default function BookmarkButton() {
  const route = getRouteApi('/p/$id/');
  const { poi, meta } = route.useLoaderData();
  const [booked, setBooked] = useState(meta.isBookmarked);
  const auth = useContext(AuthContext);

  const onClick = () => {
    if (!auth.user) {
      toast.warning('You need to be signed in.');
      return;
    }

    if (booked) {
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

  const createMutation = api.useMutation('post', '/api/v2/bookmarks/', {
    onSuccess: () => {
      setBooked((prev) => !prev);
      toast.success('Bookmark added');
    },
    onError: () => {
      toast.error('Failed to add bookmark');
    },
  });

  const deleteMutation = api.useMutation('delete', '/api/v2/bookmarks/{id}', {
    onSuccess: () => {
      setBooked((prev) => !prev);
      toast.success('Bookmark removed');
    },
    onError: () => {
      toast.error('Failed to remove bookmark');
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={onClick}>
            <BookmarkIcon
              className={cn('size-6 text-primary', {
                'fill-primary': booked,
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>{booked ? 'Remove bookmark' : 'Add to bookmarks'}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
