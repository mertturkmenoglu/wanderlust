import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { GeoHit } from 'instantsearch.js';
import { StarIcon } from 'lucide-react';
import { computeRating } from '@/lib/rating';

type Props = {
	item: GeoHit<GeoHit>;
};

export function ItemComponent({ item }: Props) {
	const rating = computeRating(item.place.totalPoints, item.place.totalVotes);

	return (
		<Link
			to="/p/$id"
			className="block text-left"
			params={{
				id: item.place.id,
			}}
		>
			<Item
				asChild
				role="listitem"
				variant="outline"
				className={cn('max-h-32 hover:bg-muted')}
			>
				<div className="block text-left">
					<ItemMedia variant="default">
						<Image
							src={item.place.assets[0]?.url ?? ''}
							alt={item.place.assets[0]?.description ?? item.place.name}
							className="aspect-video w-32 rounded-md object-cover md:w-16 lg:w-32"
							width={512}
							height={288}
						/>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="line-clamp-1">{item.place.name}</ItemTitle>
						<ItemDescription className="line-clamp-1">
							{item.place.address.city.name} /{' '}
							{item.place.address.city.countryName}
						</ItemDescription>
						<ItemDescription className="text-primary text-xs lg:text-sm">
							{item.place.category.name}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						{rating !== '0.0' && (
							<div className="flex items-center gap-1">
								<span className="font-medium text-sm">{rating}</span>
								<StarIcon className="size-3 fill-primary text-primary" />
							</div>
						)}
					</ItemActions>
				</div>
			</Item>
		</Link>
	);
}
