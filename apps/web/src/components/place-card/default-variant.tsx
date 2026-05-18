import { Image } from '@unpic/react';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemHeader,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { StarIcon } from 'lucide-react';
import { ipx } from '@/lib/ipx';
import { usePlaceCardContext } from './context';
import type { Props } from './types';

export function DefaultVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = usePlaceCardContext();

	return (
		<Item key={ctx.place.id} className={cn('group p-0', className)} {...props}>
			<ItemHeader>
				<Image
					src={ipx(ctx.asset.url, 'w_512')}
					alt={ctx.asset.description ?? ''}
					layout="constrained"
					aspectRatio={16 / 9}
					height={128}
					className="aspect-video rounded-md object-cover"
				/>
			</ItemHeader>
			<ItemContent>
				<ItemTitle className="line-clamp-1">{ctx.place.name}</ItemTitle>
				<ItemDescription className="line-clamp-1">
					{ctx.place.address.city.name} / {ctx.place.address.city.countryName}
				</ItemDescription>
				<ItemDescription className="line-clamp-1 text-primary">
					{ctx.place.category.name}
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				{ctx.rating !== '0.0' && (
					<div className="flex items-center gap-1">
						<span className="font-medium text-sm">{ctx.rating}</span>
						<StarIcon className="size-3 fill-primary text-primary" />
					</div>
				)}
			</ItemActions>
		</Item>
	);
}
