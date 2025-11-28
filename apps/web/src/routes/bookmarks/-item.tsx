import { Link, useNavigate } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { ArrowRightIcon, BookmarkIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import { useIsMobile } from '@/hooks/use-mobile';
import type { components } from '@/lib/api-types';
import { cn } from '@/lib/utils';
import { useBookmarksContext } from './-context';

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
				key={bookmark.placeId}
				className="block text-left"
				type="button"
				onClick={async () => {
					if (!isMobile) {
						ctx.setIndex(itemIndex);
					} else {
						await navigate({
							to: '/p/$id',
							params: {
								id: bookmark.placeId,
							},
						});
					}
				}}
			>
				<ItemMedia variant="default">
					<Image
						src={bookmark.place.assets[0]?.url ?? ''}
						alt={bookmark.place.assets[0]?.description ?? bookmark.place.name}
						className="aspect-video w-32 rounded-md object-cover"
						width={512}
						height={288}
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{bookmark.place.name}</ItemTitle>
					<ItemDescription>
						{bookmark.place.address.city.name} /{' '}
						{bookmark.place.address.city.country.name}
					</ItemDescription>
					<ItemDescription className="text-primary text-sm">
						{bookmark.place.category.name}
					</ItemDescription>

					<ItemFooter className="md:hidden">
						<Link
							to="/p/$id"
							params={{ id: bookmark.placeId }}
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
					<Button variant="secondary" size="icon">
						<BookmarkIcon className="fill-primary text-primary" />
					</Button>
				</ItemActions>
			</button>
		</Item>
	);
}
