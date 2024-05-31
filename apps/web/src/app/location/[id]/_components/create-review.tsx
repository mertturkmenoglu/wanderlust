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

export default function CreateReview() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string[]>([]);

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

    console.log('Creating review', { rating, comment });
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Your Review</DialogTitle>
        <DialogDescription>Share your experience with others</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="">
          <Textarea
            id="comment"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-center">
          <Rating
            id="review"
            onChange={(v) => setRating(v.value)}
          />
        </div>

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
          className="block"
          onClick={createReview}
        >
          Create review
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
