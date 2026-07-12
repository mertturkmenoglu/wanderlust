import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@wanderlust/ui/components/hover-card';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { AwardIcon, HeartIcon, StarIcon } from 'lucide-react';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { ipx } from '@/lib/ipx';
import {
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation,
} from './hooks';
import { usePlaceStore } from './store';
import type { Props } from './types';

export function ItemVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const asset = usePlaceStore((s) => s.asset);
	const place = usePlaceStore((s) => s.place);
	const meta = usePlaceStore((s) => s.meta);
	const rating = usePlaceStore((s) => s.rating);
	const numFmt = useNumberFormatter();

	const addMutation = useAddToFavoritesMutation();
	const removeMutation = useRemoveFromFavoritesMutation();

	return (
		<Item variant="outline" size="default" className={cn(className)} {...props}>
			<ItemMedia>
				<Image
					src={ipx(asset.url, 'w_256')}
					alt={asset.description ?? ''}
					height={64}
					aspectRatio={16 / 9}
					className="aspect-video h-16 rounded-md object-cover"
				/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="line-clamp-2" title={place.name}>
					{place.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-1">
					{place.address.city.name} / {place.address.city.countryName}
				</ItemDescription>
				<ItemDescription className="line-clamp-1 text-primary">
					{place.category.name}
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				{place.accolades.length > 0 && (
					<HoverCard>
						<HoverCardTrigger
							render={
								<Button variant="warning" size="icon">
									<AwardIcon />
								</Button>
							}
						/>
						<HoverCardContent className="flex flex-col gap-2 p-2">
							{place.accolades.map((acc) => (
								<Link
									key={acc.id}
									to="/accolades/$id"
									params={{ id: acc.accolade.id }}
									className="flex"
								>
									<Badge variant="warning">
										<AwardIcon />
										{acc.accolade.title}
									</Badge>
								</Link>
							))}
						</HoverCardContent>
					</HoverCard>
				)}
				{meta && (
					<Button
						variant="outline"
						type="button"
						size="icon"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							if (meta?.isFavorite) {
								removeMutation.mutate({ placeId: place.id });
							} else {
								addMutation.mutate({ placeId: place.id });
							}
						}}
					>
						<HeartIcon
							className={cn({
								'fill-primary text-primary': meta?.isFavorite,
								'fill-muted text-muted-foreground': !meta?.isFavorite,
							})}
						/>
					</Button>
				)}
				{rating !== '0.0' && (
					<Button variant="outline">
						{rating} <StarIcon className="fill-primary text-primary" />
						<span className="text-muted-foreground text-xs leading-px tracking-tighter">
							({numFmt.format(place.totalVotes)})
						</span>
					</Button>
				)}
			</ItemActions>
		</Item>
	);
}
