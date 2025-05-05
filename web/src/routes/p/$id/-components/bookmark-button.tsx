import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { BookmarkIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export default function BookmarkButton() {
  const route = getRouteApi('/p/$id/');
  const { poi, meta } = route.useLoaderData();
  const [booked, setBooked] = useState(meta.isBookmarked);
  const qc = useQueryClient();
  const auth = useContext(AuthContext);

  const onClick = () => {
    if (!auth.user) {
      toast.warning('You need to be signed in.');
      return;
    }

    mutation.mutate();
  };

  const mutation = useMutation({
    mutationKey: ['bookmark', poi.id],
    mutationFn: async () => {
      // if (booked) {
      //   await deleteBookmarkByPoiId(poi.id);
      // } else {
      //   await createBookmark({ poiId: poi.id });
      // }
      toast.error(`Not implemented ${poi.id}`);
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
