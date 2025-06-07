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
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <h2 className="line-clamp-2 scroll-m-20 text-3xl sm:text-4xl capitalize tracking-tight">
          {poi.name}
        </h2>

        <div className="flex items-center justify-between w-full sm:w-auto">
          {!!auth.user && <AddToListButton />}

          <FavoriteButton />

          <BookmarkButton />

          <Menu />
        </div>
      </div>

      <div className="mt-2 text-sm text-primary ml-auto hidden sm:block">
        {poi.category.name}
      </div>
    </div>
  );
}
