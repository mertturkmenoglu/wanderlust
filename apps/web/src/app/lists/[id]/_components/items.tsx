'use client';

import LocationCard from '@/components/blocks/LocationCard';
import { ListItem } from '@/lib/types';
import Link from 'next/link';

type Props = {
  items: ListItem[];
};

export default function Items({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/location/${item.location.id}`}
        >
          <LocationCard location={item.location} />
        </Link>
      ))}
    </div>
  );
}
