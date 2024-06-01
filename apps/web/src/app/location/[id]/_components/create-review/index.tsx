'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Rating } from '@/components/ui/rating';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import Dnd from './dnd';
import { useUpload } from './use-upload';

type Props = {
  name: string;
  locationId: string;
};

export default function CreateReview({ name, locationId }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string[]>([]);
  const [capi, fapi] = useUpload();

  function createReview() {
    setError([]);
    if (!comment) {
      setError((prev) => [...prev, 'Please enter a comment']);
    }
    if (rating === 0) {
      setError((prev) => [...prev, 'Please select a rating']);
    }

    if (!comment || rating === 0) {
      return;
    }

    console.log('Creating review', { rating, comment, locationId });
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Your Review</DialogTitle>
        <DialogDescription>Share your experience with others</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-bold capitalize">{name}</p>
          <Rating
            id="review"
            onChange={(v) => setRating(v.value)}
          />
        </div>
        <div className="">
          <Textarea
            id="comment"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <Dnd
          capi={capi}
          fapi={fapi}
        />

        <div className="flex justify-center text-center">
          {error.length > 0 && (
            <ul className="space-y-1 text-sm text-red-500">
              {error.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter className="flex !justify-center">
        <Button
          type="button"
          onClick={createReview}
        >
          Create review
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
