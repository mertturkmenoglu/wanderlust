import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { useAsset } from '@/hooks/use-asset';
import { ipx } from '@/lib/ipx';
import type { TSearchHit } from '@/lib/search';

type Props = {
	place: TSearchHit['place'];
	isCardClickable: boolean;
	onCardClick?: (v: TSearchHit['place']) => void;
};

export function Card({ place, isCardClickable, onCardClick }: Props) {
	const asset = useAsset(place.assets);

	const innerContent = (
		<Item>
			<ItemMedia>
				<Image
					src={ipx(asset.url, 'w_256')}
					alt={asset.description ?? place.name}
					className="aspect-video w-16 rounded object-cover md:w-24"
					layout="constrained"
					width={256}
					aspectRatio={16 / 9}
				/>
			</ItemMedia>

			<ItemContent>
				<ItemTitle>{place.name}</ItemTitle>
				<ItemDescription>
					{place.address.city.name} / {place.address.city.stateName}
				</ItemDescription>
				<ItemDescription className="text-primary">
					{place.category.name}
				</ItemDescription>
			</ItemContent>
		</Item>
	);

	return (
		<div className="hover:bg-muted">
			{isCardClickable ? (
				<button
					type="button"
					onClick={() => {
						if (onCardClick) {
							onCardClick(place);
						}
					}}
					className="flex gap-2 text-left md:gap-8"
				>
					{innerContent}
				</button>
			) : (
				<Link to="/p/$id" params={{ id: place.id }}>
					{innerContent}
				</Link>
			)}
		</div>
	);
}
