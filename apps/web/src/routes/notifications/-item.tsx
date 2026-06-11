import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Logo } from '@/components/logo';
import { RelativeTime } from '@/components/relative-time';
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
			return <VariantTripComment item={item} />;
		case 'trip_add_user':
			return <VariantTripAddUser item={item} />;
		case 'trip_invite':
			return <VariantTripInvite item={item} />;
		case 'trip_update':
			return <VariantTripUpdate item={item} />;
		case 'wl_event_suggest':
			return null;
		case 'wl_list_suggest':
			return null;
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
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
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
				<ItemDescription>
					<RelativeTime date={new Date(item.createdAt)} />
				</ItemDescription>
			</ItemContent>

			<MarkReadView item={item} />
		</Item>
	);
}

function VariantTripInvite({ item }: Props) {
	return (
		<Link to="/trips/invites">
			<Item variant="outline" className="hover:bg-muted">
				<UnreadBadge item={item} />

				<ItemMedia variant="default">
					<UserImage src={userImage(item.data?.from.image)} />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						{item.data?.from.name ?? 'Someone'} invited you to join a trip
					</ItemTitle>
					<ItemDescription>
						{item.data?.from.name ?? 'Someone'} invited you to join them on the
						trip "{item.data?.trip.title ?? ''}".
					</ItemDescription>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>

				<MarkReadView item={item} />
			</Item>
		</Link>
	);
}

function VariantTripAddUser({ item }: Props) {
	return (
		<Link
			to="/trips/$id/participants"
			params={{
				id: item.entityId,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<UnreadBadge item={item} />

				<ItemMedia variant="default">
					<UserImage src={userImage(item.data?.newUser.image)} />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						{item.data?.newUser.name ?? 'Someone'} accepted to join your trip
					</ItemTitle>
					<ItemDescription>
						{item.data?.newUser.name ?? 'Someone'} joined your trip.
					</ItemDescription>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>

				<MarkReadView item={item} />
			</Item>
		</Link>
	);
}

function VariantTripComment({ item }: Props) {
	return (
		<Link
			to="/trips/$id/comments"
			params={{
				id: item.entityId,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<UnreadBadge item={item} />

				<ItemMedia variant="default">
					<Logo variant="xs" />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						There is a new comment on your trip {item.data?.trip.title ?? ''}
					</ItemTitle>
					<ItemDescription>Click to see the newest comments</ItemDescription>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>

				<MarkReadView item={item} />
			</Item>
		</Link>
	);
}

function VariantTripUpdate({ item }: Props) {
	return (
		<Link
			to="/trips/$id/details"
			params={{
				id: item.entityId,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<UnreadBadge item={item} />

				<ItemMedia variant="default">
					<Logo variant="xs" />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						There are changes to your trip {item.data?.trip.title ?? ''}
					</ItemTitle>
					<ItemDescription>
						Trip dates are changed. Click to see the details.
					</ItemDescription>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>

				<MarkReadView item={item} />
			</Item>
		</Link>
	);
}
