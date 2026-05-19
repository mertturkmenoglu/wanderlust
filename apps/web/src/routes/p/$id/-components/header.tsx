import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { authClient } from '@/lib/auth';
import { AddToListButton } from './add-to-list-button';
import { BookmarkButton } from './bookmark-button';
import { FavoriteButton } from './favorite-button';
import { Menu } from './menu';
import { PlanTripDialog } from './plan-trip-dialog';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const session = authClient.useSession();
	const isAuth = !!session.data?.user;

	return (
		<div className={cn(className)}>
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="line-clamp-2 scroll-m-20 text-3xl capitalize tracking-tight sm:text-4xl">
					{place.name}
				</h2>

				<div className="flex w-full items-center justify-between sm:w-auto">
					{isAuth && <PlanTripDialog />}

					{isAuth && <AddToListButton />}

					<FavoriteButton />

					<BookmarkButton />

					<Menu />
				</div>
			</div>

			<div className="mt-2 ml-auto hidden text-primary text-sm sm:block">
				{place.category.name}
			</div>
		</div>
	);
}
