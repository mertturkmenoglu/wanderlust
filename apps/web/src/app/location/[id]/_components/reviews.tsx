'use client';

import EmptyContent from '@/components/blocks/EmptyContent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, rpcPaginated } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';

type Props = {
  locationId: string;
};

export default function Reviews({ locationId }: Props) {
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);

    // other logic
  };
  const query = useQuery({
    queryKey: ['reviews', locationId],
    queryFn: async () => {
      return rpcPaginated(() =>
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
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <div className="mb-32">
      <h2 className="text-2xl font-bold">Reviews</h2>
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

      {/* locationId: string;
    rating: number;
    comment: string;
    media?: Json | undefined; */}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Create a review</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Your Review</DialogTitle>
            <DialogDescription>
              Share your experience with others
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                className="col-span-4"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="rating"
                className="text-right"
              >
                Give a rating
              </Label>
              <div>
                <Rating onClick={handleRating} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
