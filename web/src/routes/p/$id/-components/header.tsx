import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import AddToListButton from './add-to-list-button';
import BookmarkButton from './bookmark-button';
import FavoriteButton from './favorite-button';
import Menu from './menu';

type Props = {
  className?: string;
};

export function Header({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const auth = route.useRouteContext().auth;

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between">
        <h2 className="line-clamp-2 scroll-m-20 text-4xl capitalize tracking-tight">
          {poi.name}
        </h2>

        <div className="flex items-center">
          {!!auth.user && <AddToListButton />}

          <FavoriteButton />

          <BookmarkButton />

          <Menu />
        </div>
      </div>

      <p className="mt-2 text-sm text-primary">{poi.category.name}</p>
    </div>
  );
}
