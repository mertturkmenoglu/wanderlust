import { StarIcon } from 'lucide-react';
import { usePlaceCardContext } from './context';

export function Info() {
  const { place, rating } = usePlaceCardContext();

  return (
    <>
      <div className="mt-2">
        <div className="flex items-baseline gap-2 justify-between">
          <div className="line-clamp-1 text-lg font-semibold capitalize">
            {place.name}
          </div>

          {rating !== '0.0' && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">{rating}</span>
              <StarIcon className="text-primary fill-primary size-3" />
            </div>
          )}
        </div>

        <div className="line-clamp-1 text-sm text-muted-foreground">
          {place.address.city.name} / {place.address.city.country.name}
        </div>
      </div>

      <div className="mt-1">
        <div className="text-sm text-primary">{place.category.name}</div>
      </div>
    </>
  );
}
