import { cn } from '@/lib/utils';
import { useId } from 'react';
import { Rating } from './rating';

type Props = {
  rating: number;
  votes: number;
  starsClassName?: string;
  className?: string;
  showNumbers?: boolean;
};

export function FormattedRating({
  rating,
  votes,
  starsClassName,
  className,
  showNumbers = true,
}: Props) {
  const id = useId();
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    compactDisplay: 'short',
    notation: 'compact',
  });

  const formattedRating = fmt.format(votes);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Rating
        id={id}
        onChange={() => {
          // do nothing
        }}
        defaultValue={rating}
        disabled
        starsClassName={cn(starsClassName)}
      />
      {showNumbers && (
        <div className="flex items-center space-x-1">
          <span className="font-bold">{rating.toFixed(1)}</span>
          <span>({formattedRating})</span>
        </div>
      )}
    </div>
  );
}
