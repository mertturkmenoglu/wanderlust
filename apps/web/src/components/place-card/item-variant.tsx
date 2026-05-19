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
import { StarIcon } from 'lucide-react';
import { ipx } from '@/lib/ipx';
import { usePlaceCardContext } from './context';
import type { Props } from './types';

export function ItemVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = usePlaceCardContext();

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
			{ctx.rating !== '0.0' && (
				<ItemActions>
					<Button variant="outline">
						<div className="flex items-center gap-1">
							<span className="font-medium text-sm">{ctx.rating}</span>
							<StarIcon className="size-4 fill-primary text-white" />
						</div>
					</Button>
				</ItemActions>
			)}
		</Item>
	);
}
