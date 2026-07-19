import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Card, CardHeader, CardTitle } from '@wanderlust/ui/components/card';
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { ipx } from '@/lib/ipx';
import type { MinimalPlaceProps } from './types';

export function MinimalPlaceCard(props: MinimalPlaceProps) {
	if (props.as === 'link') {
		return (
			<Link to="/dashboard/places/$id" params={{ id: props.place.id }}>
				{props.variant === 'item' ? (
					<MinimalItemVariant {...props} />
				) : (
					<MinimalDefaultVariant {...props} />
				)}
			</Link>
		);
	}

	if (props.variant === 'item') {
		return <MinimalItemVariant {...props} />;
	}

	return <MinimalDefaultVariant {...props} />;
}

function MinimalItemVariant({
	place,
	className,
	variant = 'item',
	...props
}: MinimalPlaceProps) {
	return (
		<Item variant="outline" size="sm" className={cn(className)} {...props}>
			<ItemMedia>
				<Image
					src={ipx(place.image, 'w_512')}
					alt={place.name}
					layout="constrained"
					aspectRatio={16 / 9}
					height={64}
					className="aspect-video h-16 rounded-md object-cover"
				/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="line-clamp-2" title={place.name}>
					{place.name}
				</ItemTitle>
			</ItemContent>
		</Item>
	);
}

function MinimalDefaultVariant({
	place,
	className,
	variant = 'default',
	...props
}: MinimalPlaceProps) {
	return (
		<Card
			size="sm"
			className={cn('group @container relative', className)}
			{...props}
		>
			<Image
				src={ipx(place.image, 'w_512')}
				alt={place.name}
				layout="constrained"
				aspectRatio={16 / 9}
				height={128}
				className="aspect-video w-full object-cover"
			/>
			<CardHeader>
				<CardTitle className="line-clamp-2 h-10">{place.name}</CardTitle>
			</CardHeader>
		</Card>
	);
}
