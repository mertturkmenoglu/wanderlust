import { useId } from 'react';
import { Rating } from './rating';

type Props = {
  rating: number;
  votes: number;
  starsClassName?: string;
  showNumbers?: boolean;
};

export default function FormattedRating({
  rating,
  votes,
  starsClassName,
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
    <div className="flex items-center space-x-2">
      <Rating
        id={id}
        onChange={() => {}}
        defaultValue={rating}
        disabled={true}
        starsClassName={starsClassName}
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
