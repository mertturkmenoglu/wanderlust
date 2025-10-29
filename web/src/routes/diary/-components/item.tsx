import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { GlobeIcon, LockIcon } from 'lucide-react';

type Props = {
  entry: components['schemas']['Diary'];
};

export function EntryItem({ entry }: Props) {
  return (
    <Item
      variant="outline"
      className="hover:bg-muted"
      asChild
    >
      <Link
        to="/diary/$id"
        params={{
          id: entry.id,
        }}
      >
        <ItemMedia variant="icon">
          {entry.shareWithFriends ? <GlobeIcon /> : <LockIcon />}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{entry.title}</ItemTitle>
          <ItemDescription>{format(entry.date, 'PPP')}</ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
