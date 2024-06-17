import { Location } from '@/lib/types';
import { cn } from '@/lib/utils';
import FormattedRating from '../FormattedRating';

type Props = {
  location: Location;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LocationCard({ location, className, ...props }: Props) {
  const image = location.media[0];

  const rating = (() => {
    if (location.totalVotes === 0) return 0;
    return location.totalPoints / location.totalVotes;
  })();

  return (
    <div
      key={location.id}
      className={cn('group ', className)}
      {...props}
    >
      <img
        src={image.url}
        alt={image.alt}
        className="aspect-square size-[256px] w-full rounded-xl object-cover"
      />

      <div className="my-2">
        <FormattedRating
          rating={rating}
          votes={location.totalVotes}
          starsClassName="size-4"
        />
        <div className="mt-2 line-clamp-1 text-lg font-semibold capitalize">
          {location.name}
        </div>
        <div className="line-clamp-1 text-sm text-muted-foreground">
          {location.address.city} / {location.address.state}
        </div>
      </div>

      <div>
        <div className="flex-1 space-y-2">
          <div className="text-sm text-primary">{location.category.name}</div>
        </div>
      </div>
    </div>
  );
}
