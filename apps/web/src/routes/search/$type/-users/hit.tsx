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
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { TUserHit } from '@/lib/search';

export type Props = {
	hit: THit;
};

export function Hit(props: Readonly<Props>) {
	const hit = props.hit as unknown as TUserHit;

	return (
		<Link
			to="/u/$username"
			params={{
				username: hit.username,
			}}
		>
			<Item variant="outline" size="default" className="hover:bg-muted">
				<ItemMedia>
					<Image
						src={ipx(userImage(hit.image), 'w_256')}
						alt={hit.name}
						height={64}
						aspectRatio={16 / 9}
						className="aspect-video h-16 rounded-md object-cover"
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="line-clamp-2" title={hit.name}>
						{hit.name}
					</ItemTitle>
					<ItemDescription className="line-clamp-1">
						@{hit.username}
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}
