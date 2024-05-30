'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon } from 'lucide-react';

type Props = {
  locationId: string;
};

export default function BookmarkButton({ locationId }: Props) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['bookmark', locationId],
    queryFn: async () => {
      return rpc(() =>
        api.bookmarks[':id'].$get({
          param: {
            id: locationId,
          },
        })
      );
    },
  });

  const mutation = useMutation({
    mutationKey: ['bookmark', locationId],
    mutationFn: async () => {
      if (query.data) {
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
      query.refetch();
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
          'fill-primary': query.data,
        })}
      />
    </Button>
  );
}
