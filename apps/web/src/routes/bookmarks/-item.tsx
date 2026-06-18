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
import { BookmarkIcon, HeartIcon } from 'lucide-react';
import { useAsset } from '@/hooks/use-asset';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookmarksContext } from './-context';
import type { TBookmark } from './-hooks';

type Props = {
	bookmark: TBookmark;
	itemIndex: number;
};

export function BookmarkItem({ bookmark, itemIndex }: Props) {
	const ctx = useBookmarksContext();
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { place } = bookmark;
	const asset = useAsset(place.assets);

	const onClick = async () => {
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
	};

	return (
		<Item
			asChild
			variant="outline"
			className={cn('max-h-32', {
				'border border-primary bg-primary/5':
					itemIndex === ctx.index && !isMobile,
				'hover:bg-muted': itemIndex !== ctx.index,
			})}
		>
			<button className="block text-left" type="button" onClick={onClick}>
				<ItemMedia variant="default">
					<Image
						src={asset.url ?? ''}
						alt={asset.description ?? place.name}
						className="aspect-video w-32 rounded-md object-cover md:w-16 lg:w-32"
						width={512}
						height={288}
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="line-clamp-1">{place.name}</ItemTitle>
					<ItemDescription className="line-clamp-1">
						{place.address.city.name} / {place.address.city.countryName}
					</ItemDescription>
					<ItemDescription className="text-primary text-xs lg:text-sm">
						{place.category.name}
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="secondary" size="icon">
						<BookmarkIcon className="fill-primary text-primary" />
					</Button>
					<Button variant="secondary" size="icon">
						<HeartIcon
							className={cn({
								'fill-primary text-primary': bookmark.meta.isFavorite,
								'text-muted-foreground': !bookmark.meta.isFavorite,
							})}
						/>
					</Button>
				</ItemActions>
			</button>
		</Item>
	);
}
