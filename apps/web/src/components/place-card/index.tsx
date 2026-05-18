import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { StarIcon } from 'lucide-react';
import { PlaceCardContextProvider, usePlaceCardContext } from './context';
import { DotNavigation } from './dot-navigation';
import { Images } from './images';
import { Info } from './info';
import { NavigationButton } from './navigation-button';
import type { Props } from './types';

export function PlaceCard(props: Props) {
	return (
		<PlaceCardContextProvider place={props.place}>
			<Content {...props} />
		</PlaceCardContextProvider>
	);
}

function Content({
	className,
	hoverEffects = true,
	variant = 'default',
	...props
}: Props) {
	const ctx = usePlaceCardContext();

	if (variant === 'item') {
		return (
			<Item variant="outline">
				<ItemMedia>
					<Image
						src={ctx.place.assets[0]?.url ?? ''}
						alt={ctx.place.assets[0]?.description ?? ''}
						width={160}
						height={160}
						className="object-cover"
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{ctx.place.name}</ItemTitle>
					<ItemDescription>
						{ctx.place.address.city.name}/{ctx.place.address.city.countryName}
					</ItemDescription>
					<ItemDescription>{ctx.place.category.name}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="outline">
						{ctx.rating !== '0.0' && (
							<div className="flex items-center gap-1">
								<span className="font-medium text-sm">{ctx.rating}</span>
								<StarIcon className="size-4 fill-primary text-white" />
							</div>
						)}
					</Button>
				</ItemActions>
			</Item>
		);
	}

	return (
		<div
			key={ctx.place.id}
			className={cn(
				'group rounded-md transition duration-300 ease-in-out',
				{
					'hover:-m-2 hover:bg-gray-100 hover:p-2': hoverEffects,
				},
				className,
			)}
			{...props}
		>
			<div className="relative">
				<NavigationButton type="previous" />

				<Images />

				<NavigationButton type="next" />

				<DotNavigation />
			</div>

			<Info />
		</div>
	);
}
