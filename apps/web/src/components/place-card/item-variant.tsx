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
import { usePlaceCardContext } from './context';
import {
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation,
} from './hooks';
import type { Props } from './types';

export function ItemVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = usePlaceCardContext();
	const numFmt = useNumberFormatter();

	const addMutation = useAddToFavoritesMutation();
	const removeMutation = useRemoveFromFavoritesMutation();

	return (
		<Item variant="outline" size="default" className={cn(className)} {...props}>
			<ItemMedia>
				<Image
					src={ipx(ctx.asset.url, 'w_256')}
					alt={ctx.asset.description ?? ''}
					height={64}
					aspectRatio={16 / 9}
					className="aspect-video h-16 rounded-md object-cover"
				/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="line-clamp-2" title={ctx.place.name}>
					{ctx.place.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-1">
					{ctx.place.address.city.name} / {ctx.place.address.city.countryName}
				</ItemDescription>
				<ItemDescription className="line-clamp-1 text-primary">
					{ctx.place.category.name}
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				{ctx.place.accolades.length > 0 && (
					<HoverCard>
						<HoverCardTrigger asChild>
							<Button variant="warning" size="icon">
								<AwardIcon />
							</Button>
						</HoverCardTrigger>
						<HoverCardContent className="flex flex-col gap-2 p-2">
							{ctx.place.accolades.map((acc) => (
								<Link
									key={acc.id}
									to="/a/$id"
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
				{ctx.meta && (
					<Button
						variant="outline"
						type="button"
						size="icon"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							if (ctx.meta?.isFavorite) {
								removeMutation.mutate({ placeId: ctx.place.id });
							} else {
								addMutation.mutate({ placeId: ctx.place.id });
							}
						}}
					>
						<HeartIcon
							className={cn({
								'fill-primary text-primary': ctx.meta?.isFavorite,
								'fill-muted text-muted-foreground': !ctx.meta?.isFavorite,
							})}
						/>
					</Button>
				)}
				{ctx.rating !== '0.0' && (
					<Button variant="outline">
						{ctx.rating} <StarIcon className="fill-primary text-primary" />
						<span className="text-muted-foreground text-xs leading-px tracking-tighter">
							({numFmt.format(ctx.place.totalVotes)})
						</span>
					</Button>
				)}
			</ItemActions>
		</Item>
	);
}
