'use client';

import { Rating } from '@/components/ui/rating';
import { useId } from 'react';

type Props = {
  rating: number;
  votes: number;
};

export default function RatingElement({ rating, votes }: Props) {
  const id = useId();
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    compactDisplay: 'short',
    notation: 'compact',
  });

  const formattedRating = fmt.format(votes);

  return (
    <div className="flex items-center space-x-2">
      <Rating
        id={id}
        onChange={() => {}}
        defaultValue={rating}
        disabled={true}
      />
      <div className="flex items-center space-x-1">
        <span className="font-bold">{rating}</span>
        <span>({formattedRating})</span>
      </div>
    </div>
  );
}
