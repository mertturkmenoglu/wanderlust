import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Logo } from '@/components/logo';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import type { TNotification } from '@/stores/notifications-context';
import { MarkReadView } from './-mark-read';
import { UnreadBadge } from './-unread-badge';

type Props = {
	item: TNotification;
};

export function NotificationItem({ item }: Props) {
	switch (item.type) {
		case 'user_follow':
			return <VariantUserFollow item={item} />;
		case 'trip_add_comment':
			return <></>;
		case 'trip_add_user':
			return <></>;
		case 'trip_invite':
			return <></>;
		case 'trip_update':
			return <></>;
		case 'wl_event_suggest':
			return <></>;
		case 'wl_list_suggest':
			return <></>;
		case 'wl_system':
			return <VariantWanderlustSystem item={item} />;
		default:
			return null;
	}
}

function VariantUserFollow({ item }: Props) {
	return (
		<Link
			to="/u/$username"
			params={{
				username: item.data?.follower.username ?? '',
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<UnreadBadge item={item} />

				<ItemMedia variant="default">
					<UserImage src={userImage(item.data?.follower.image)} />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						{item.data?.follower.name ?? 'Someone'} started following you
					</ItemTitle>
					<ItemDescription>
						Say hi to {item.data?.follower.name ?? 'Someone'}
					</ItemDescription>
				</ItemContent>

				<MarkReadView item={item} />
			</Item>
		</Link>
	);
}

function VariantWanderlustSystem({ item }: Props) {
	return (
		<Item variant="outline" className="hover:bg-muted">
			<UnreadBadge item={item} />

			<ItemMedia variant="default">
				<Logo variant="xs" />
			</ItemMedia>

			<ItemContent>
				<ItemTitle>{item.data?.message ?? ''}</ItemTitle>
				<ItemDescription>
					This notification is sent to you by the Wanderlust system.
				</ItemDescription>
			</ItemContent>

			<MarkReadView item={item} />
		</Item>
	);
}
