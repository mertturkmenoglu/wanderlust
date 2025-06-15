import { FormattedRating } from '@/components/kit/formatted-rating';
import { Separator } from '@/components/ui/separator';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  review: components['schemas']['Review'];
  isLast: boolean;
};

export function Card({ review, isLast }: Props) {
  return (
    <Link
      to="/p/$id"
      params={{
        id: review.poiId,
      }}
      className="block space-y-4"
    >
      <div className="grid grid-cols-12">
        <div className="col-span-10 grid grid-cols-12 items-center">
          <span className="hidden lg:block lg:col-span-1">Reviewed </span>
          <span className="text-primary lg:mx-4 col-span-6 md:col-span-4">
            {review.poi.name}
          </span>
          <FormattedRating
            rating={review.rating}
            votes={1}
            showNumbers={false}
            starsClassName="size-3"
            className="col-span-3 md:col-span-1"
          />
          <span className="ml-2 text-sm col-span-2 md:col-span-1">
            {review.rating} stars
          </span>
          <span className="ml-2 text-xs hidden md:block md:col-span-5">
            {review.content.slice(0, 50) + '...'}
          </span>
        </div>
        <span className="text-sm col-span-2 ml-auto text-right">
          {formatDistanceToNow(review.createdAt)} ago
        </span>
      </div>
      {!isLast && <Separator />}
    </Link>
  );
}
