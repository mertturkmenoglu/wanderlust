'use client';

import { ListItem } from '@/lib/types';

type Props = {
  items: ListItem[];
};

export default function Items({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <pre key={item.locationId}>{JSON.stringify(item, null, 2)}</pre>
      ))}
    </div>
  );
}
