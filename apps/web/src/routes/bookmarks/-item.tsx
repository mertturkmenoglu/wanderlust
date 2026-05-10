import { useNavigate } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { BookmarkIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookmarksContext } from './-context';
import type { TBookmark } from './-types';

type Props = {
	bookmark: TBookmark;
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
						className="aspect-video w-32 rounded-md object-cover md:w-16 lg:w-32"
						width={512}
						height={288}
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="line-clamp-1">{bookmark.place.name}</ItemTitle>
					<ItemDescription className="line-clamp-1">
						{bookmark.place.address.city.name} /{' '}
						{bookmark.place.address.city.countryName}
					</ItemDescription>
					<ItemDescription className="text-primary text-xs lg:text-sm">
						{bookmark.place.category.name}
					</ItemDescription>
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
