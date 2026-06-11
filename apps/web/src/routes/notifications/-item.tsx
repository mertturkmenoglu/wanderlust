import { Link } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { CheckCheckIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Logo } from '@/components/logo';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import {
	type TNotification,
	useNotificationsContext,
} from '@/stores/notifications-context';

type Props = {
	item: TNotification;
};

export function NotificationItem({ item }: Props) {
	const { markAsRead } = useNotificationsContext();

	const content = useMemo(() => {
		switch (item.type) {
			case 'user_follow':
				return (
					<Link
						to="/u/$username"
						params={{
							username: item.data?.follower.username ?? '',
						}}
					>
						<Item variant="outline" className="hover:bg-muted">
							<ItemActions>
								{item.readAt === null ? (
									<Badge variant="default">Unread</Badge>
								) : null}
							</ItemActions>
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
							<ItemActions>
								<Button
									variant="default"
									size="icon-sm"
									type="button"
									disabled={item.readAt !== null}
									onClick={async (e) => {
										e.preventDefault();
										e.stopPropagation();
										await markAsRead(item.id);
									}}
								>
									<CheckCheckIcon />
									<span className="sr-only">Mark as read</span>
								</Button>
							</ItemActions>
						</Item>
					</Link>
				);
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
				return (
					<Item variant="outline" className="hover:bg-muted">
						<ItemActions>
							{item.readAt === null ? (
								<Badge variant="default">New</Badge>
							) : null}
						</ItemActions>
						<ItemMedia variant="default">
							<Logo variant="xs" />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{item.data?.message ?? ''}</ItemTitle>
							<ItemDescription>
								This notification is sent to you by the Wanderlust system.
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button
								variant="default"
								size="icon-sm"
								type="button"
								disabled={item.readAt !== null}
								onClick={async (e) => {
									e.preventDefault();
									e.stopPropagation();
									await markAsRead(item.id);
								}}
							>
								<CheckCheckIcon />
								<span className="sr-only">Mark as read</span>
							</Button>
						</ItemActions>
					</Item>
				);
			default:
				return null;
		}
	}, [item, markAsRead]);

	return content;
}
