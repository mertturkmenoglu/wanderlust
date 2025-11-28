import { PlaceCard } from '@/components/blocks/place-card';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';

type Props = {
  dataKey: 'new' | 'popular' | 'featured' | 'favorite';
  data: components['schemas']['Place'][];
};

function getTitle(type: Props['dataKey']) {
  switch (type) {
    case 'new':
      return 'New Places';
    case 'popular':
      return 'Popular Places';
    case 'featured':
      return 'Featured Places';
    case 'favorite':
      return 'Favorite Places';
    default:
      return '';
  }
}

export function PlacesGrid({ dataKey: key, data }: Props) {
  const title = getTitle(key);
  const sliced = data.slice(0, 6);
  const isEmpty = sliced.length === 0;

  return (
    <div className="mx-auto">
      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tighter text-accent-foreground">
        {title}
      </h2>

      <div className="my-4 grid grid-cols-2 gap-4 lg:gap-8 lg:grid-cols-3">
        {isEmpty && <div>No data available.</div>}
        {!isEmpty &&
          data.slice(0, 6).map((place) => (
            <Link
              key={place.id}
              to="/p/$id"
              params={{ id: place.id }}
            >
              <PlaceCard place={place} />
            </Link>
          ))}
      </div>
    </div>
  );
}
