import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRightIcon, GlobeIcon, LockIcon } from 'lucide-react';

type Props = {
  list: components['schemas']['GetAllListsOfUserOutputBody']['lists'][number];
};

export function ListItem({ list }: Props) {
  return (
    <Link
      to="/lists/$id"
      params={{
        id: list.id,
      }}
    >
      <Item
        variant="outline"
        className="hover:bg-muted"
      >
        <ItemMedia variant="icon">
          {list.isPublic ? <GlobeIcon /> : <LockIcon />}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{list.name}</ItemTitle>
          <ItemDescription
            title={`Created at ${new Date(list.createdAt).toLocaleString()}`}
          >
            Created {formatDistanceToNow(list.createdAt)} ago
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
          >
            <ArrowRightIcon />
          </Button>
        </ItemActions>
      </Item>
    </Link>
  );
}
