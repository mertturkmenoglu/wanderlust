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
	follower: Outputs['users']['listFollowers']['followers'][number];
};

export function FollowersItem({ follower }: Props) {
	return (
		<Link to="/u/$username" params={{ username: follower.username }}>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="image">
					<UserImage
						src={ipx(userImage(follower.image), 'w_64')}
						className="size-16"
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{follower.name}</ItemTitle>
					<ItemDescription>@{follower.username}</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}
