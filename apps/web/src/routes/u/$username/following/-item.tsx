import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';

type Props = {
	following: Outputs['users']['listFollowing']['following'][number];
};

export function FollowingItem({ following }: Props) {
	return (
		<Link to="/u/$username" params={{ username: following.username }}>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="image">
					<UserImage
						src={ipx(userImage(following.image), 'w_64')}
						className="size-16"
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{following.name}</ItemTitle>
					<ItemDescription>@{following.username}</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}
