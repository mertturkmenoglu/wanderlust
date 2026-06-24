import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import type { Hit as THit } from 'instantsearch.js';
import { ipx } from '@/lib/ipx';
import type { TCityHit } from '@/lib/search';

export type Props = {
	hit: THit;
};

export function Hit(props: Readonly<Props>) {
	const hit = props.hit as unknown as TCityHit;

	return (
		<Link
			to="/cities/$"
			params={{
				_splat: `${hit.city.id}/${hit.city.name}`,
			}}
		>
			<Item variant="outline" size="default" className="hover:bg-muted">
				<ItemMedia>
					<Image
						src={ipx(hit.city.image, 'w_256')}
						alt={hit.city.name}
						height={64}
						aspectRatio={16 / 9}
						className="aspect-video h-16 rounded-md object-cover"
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="line-clamp-2" title={hit.city.name}>
						{hit.city.name}
					</ItemTitle>
					<ItemDescription className="line-clamp-1">
						{hit.city.stateName} / {hit.city.countryName}
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}
