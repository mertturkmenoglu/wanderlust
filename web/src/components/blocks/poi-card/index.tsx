import type { components } from '@/lib/api-types';
import { ipx } from '@/lib/ipx';
import { computeRating } from '@/lib/rating';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import { useState } from 'react';

type P = components['schemas']['Poi'];

type Props = {
  poi: Pick<
    P,
    | 'id'
    | 'name'
    | 'category'
    | 'address'
    | 'totalVotes'
    | 'totalPoints'
    | 'media'
  >;
  hoverEffects?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PoiCard({
  poi,
  className,
  hoverEffects = true,
  ...props
}: Props) {
  const [index, setIndex] = useState(0);
  const el = poi.media[index];
  const rating = computeRating(poi.totalPoints, poi.totalVotes);

  if (!el) {
    return <></>;
  }

  return (
    <div
      key={poi.id}
      className={cn(
        'group transition duration-300 ease-in-out rounded-md',
        {
          'hover:bg-gray-100 hover:-m-2 hover:p-2': hoverEffects,
        },
        className,
      )}
      {...props}
    >
      <div className="relative">
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-80 duration-200"
          disabled={index === 0}
          onClick={(e) => {
            e.preventDefault();
            setIndex((prev) => prev - 1);
          }}
        >
          <ChevronLeftIcon className="size-4 text-primary" />
          <span className="sr-only">Previous</span>
        </button>

        {/* Preload previous and next images */}
        {index !== 0 && (
          <img
            src={ipx(poi.media[index - 1]!.url, 'w_512')}
            alt={poi.media[index - 1]!.alt}
            className="hidden"
          />
        )}

        {index !== poi.media.length - 1 && (
          <img
            src={ipx(poi.media[index + 1]!.url, 'w_512')}
            alt={poi.media[index + 1]!.alt}
            className="hidden"
          />
        )}

        <img
          src={ipx(el.url, 'w_512')}
          alt={el.alt}
          className="aspect-video w-full rounded-md object-cover"
        />

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-80 duration-200"
          disabled={index === poi.media.length - 1}
          onClick={(e) => {
            e.preventDefault();
            setIndex((prev) => prev + 1);
          }}
        >
          <ChevronRightIcon className="size-4 text-primary" />
          <span className="sr-only">Next</span>
        </button>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-80 duration-200">
          {Array.from({ length: poi.media.length }).map((_, i) => (
            <div
              key={i}
              className={cn('size-2 rounded-full border border-border', {
                'bg-primary': i === index,
              })}
            />
          ))}
        </div>
      </div>

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
    </div>
  );
}
