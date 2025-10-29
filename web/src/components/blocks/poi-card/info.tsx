import { StarIcon } from 'lucide-react';
import { usePoiCardContext } from './context';

export function Info() {
  const { poi, rating } = usePoiCardContext();

  return (
    <>
      <div className="mt-2">
        <div className="flex items-baseline gap-2 justify-between">
          <div className="line-clamp-1 text-lg font-semibold capitalize">
            {poi.name}
          </div>

          {rating !== '0.0' && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">{rating}</span>
              <StarIcon className="text-primary fill-primary size-3" />
            </div>
          )}
        </div>

        <div className="line-clamp-1 text-sm text-muted-foreground">
          {poi.address.city.name} / {poi.address.city.country.name}
        </div>
      </div>

      <div className="mt-1">
        <div className="text-sm text-primary">{poi.category.name}</div>
      </div>
    </>
  );
}
