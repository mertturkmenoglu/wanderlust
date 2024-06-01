'use client';

import EmptyContent from '@/components/blocks/EmptyContent';
import { Skeleton } from '@/components/ui/skeleton';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

type Props = {
  locationId: string;
};

export default function ReviewList({ locationId }: Props) {
  const query = useQuery({
    queryKey: ['reviews', locationId],
    queryFn: async () => {
      return rpc(() =>
        api.reviews.location[':id'].$get({
          param: {
            id: locationId,
          },
          query: {
            pageSize: '10',
            page: '1',
          },
        })
      );
    },
  });

  if (query.isLoading) {
    return (
      <div className="mt-16 flex w-full justify-center">
        <Skeleton className="h-32 w-full rounded" />
      </div>
    );
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <>
      {query.data && query.data.data.length === 0 && (
        <EmptyContent
          className="my-16"
          showBackButton={false}
        />
      )}
      {query.data &&
        query.data.data.map((review) => (
          <div key={review.id}>
            <h3>{review.comment}</h3>
            <p>{review.user.username}</p>
          </div>
        ))}
    </>
  );
}
