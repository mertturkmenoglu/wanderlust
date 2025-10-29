import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { components } from '@/lib/api-types';
import { cn } from '@/lib/utils';
import { useBookmarksContext } from './-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon, BookmarkIcon } from 'lucide-react';

type Props = {
  bookmark: components['schemas']['GetUserBookmarksOutputBody']['bookmarks'][number];
  itemIndex: number;
};

export function BookmarkItem({ bookmark, itemIndex }: Props) {
  const ctx = useBookmarksContext();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <Item
      asChild
      role="listitem"
      variant="outline"
      className={cn('max-h-32', {
        'border border-primary bg-primary/5':
          itemIndex === ctx.index && !isMobile,
        'hover:bg-muted': itemIndex !== ctx.index,
      })}
    >
      <button
        key={bookmark.poiId}
        className="block text-left"
        onClick={async () => {
          if (!isMobile) {
            ctx.setIndex(itemIndex);
          } else {
            await navigate({
              to: '/p/$id',
              params: {
                id: bookmark.poiId,
              },
            });
          }
        }}
      >
        <ItemMedia variant="default">
          <Image
            src={bookmark.poi.images[0]?.url ?? ''}
            alt={bookmark.poi.images[0]?.alt ?? bookmark.poi.name}
            className="aspect-video rounded-md object-cover w-32"
            width={512}
            height={288}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{bookmark.poi.name}</ItemTitle>
          <ItemDescription>
            {bookmark.poi.address.city.name} /{' '}
            {bookmark.poi.address.city.country.name}
          </ItemDescription>
          <ItemDescription className="text-sm text-primary">
            {bookmark.poi.category.name}
          </ItemDescription>

          <ItemFooter className="md:hidden">
            <Link
              to="/p/$id"
              params={{ id: bookmark.poiId }}
              className={cn(
                'px-0!',
                buttonVariants({ variant: 'link', size: 'sm' }),
              )}
            >
              <span>See Details</span>
              <ArrowRightIcon />
            </Link>
          </ItemFooter>
        </ItemContent>
        <ItemActions>
          <Button
            variant="secondary"
            size="icon"
          >
            <BookmarkIcon className="text-primary fill-primary" />
          </Button>
        </ItemActions>
      </button>
    </Item>
  );
}
