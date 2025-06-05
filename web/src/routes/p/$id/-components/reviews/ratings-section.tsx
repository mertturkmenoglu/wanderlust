import FormattedRating from '@/components/kit/formatted-rating';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { computeRating } from '@/lib/rating';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { LoaderCircleIcon, StarIcon } from 'lucide-react';
import { CreateReviewDialog } from './create/create-dialog';
import { ReviewImages } from './images';

type Props = {
  className?: string;
};

const fmt = Intl.NumberFormat('en-US', {
  style: 'decimal',
  compactDisplay: 'short',
  notation: 'compact',
});

export function RatingsSection({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const rating = computeRating(poi.totalPoints, poi.totalVotes);

  const query = api.useQuery('get', '/api/v2/reviews/poi/{id}/ratings', {
    params: {
      path: {
        id: poi.id,
      },
    },
  });

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          'bg-gradient-to-r from-accent/50 to-primary/10',
          'flex flex-col gap-8',
          'p-6 h-min rounded-md',
        )}
      >
        <div>
          <h3 className="font-bold text-xl text-primary">Reviews</h3>
          <div className="my-2 flex items-center gap-4">
            <span className="font-bold text-6xl text-primary">{rating}</span>
            <div>
              <FormattedRating
                rating={parseFloat(rating)}
                votes={poi.totalVotes}
                showNumbers={false}
              />
              <span className="text-xs text-muted-foreground tracking-tight">
                {fmt.format(poi.totalVotes)} reviews
              </span>
            </div>
          </div>
          <CreateReviewDialog />
        </div>

        {query.isLoading && (
          <LoaderCircleIcon className="size-16 my-auto mx-auto animate-spin text-primary" />
        )}

        {query.data && <Ratings ratings={query.data} />}
      </div>

      <div className="mt-4">
        <ReviewImages />
      </div>
    </div>
  );
}

type RatingsProps = {
  ratings: components['schemas']['GetRatingsByPoiIdOutputBody'];
};

function Ratings({ ratings }: RatingsProps) {
  const entries = Object.entries(ratings.ratings).map(
    (v) => [+v[0], v[1]] as const,
  );
  const sorted = entries.sort((a, b) => b[0] - a[0]);

  return (
    <div className="w-full space-y-2">
      {sorted.map(([rating, count]) => (
        <div
          key={rating}
          className="grid grid-cols-12 items-center text-right gap-2"
        >
          <div className="flex items-center gap-1 justify-end text-primary text-sm font-medium">
            {rating} <StarIcon className="size-3 fill-primary text-primary" />
          </div>
          <Progress
            value={(count * 100) / ratings.totalVotes}
            className="col-span-10"
          />
          <span className="col-span-1 text-xs text-primary tabular-nums">
            ({fmt.format(count)})
          </span>
        </div>
      ))}
    </div>
  );
}
