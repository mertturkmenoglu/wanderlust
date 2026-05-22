import { Link } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { Invite } from './-hooks';
import { Menu } from './-menu';

type Props = {
	invite: Invite;
	isPrivileged: boolean;
};

export function InviteItem({ invite, isPrivileged }: Props) {
	return (
		<Link
			to="/u/$username"
			params={{
				username: invite.toUser.username,
			}}
		>
			<Item variant="outline">
				<UserImage
					src={ipx(userImage(invite.toUser.image), 'w_512')}
					className="size-12"
				/>

				<ItemContent>
					<ItemTitle>{invite.toUser.name}</ItemTitle>
					<ItemDescription>@{invite.toUser.username}</ItemDescription>
				</ItemContent>

				<ItemActions>
					<Badge variant="secondary" className="capitalize">
						As: {invite.role}
					</Badge>
					{isPrivileged && <Menu invite={invite} />}
				</ItemActions>
			</Item>
		</Link>
	);
}
