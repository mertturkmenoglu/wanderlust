import { linkOptions } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { BellIcon, InboxIcon, SearchIcon } from 'lucide-react';
import { useNotificationsContext } from '@/stores/notifications-context';
import { IconLink, type IconLinkProps } from './icon-link';

type Item = IconLinkProps & { key: string };

const items: Item[] = [
	{
		key: 'search',
		icon: SearchIcon,
		label: 'Search',
		link: linkOptions({
			to: '/search',
		}),
	},
	{
		key: 'messages',
		icon: InboxIcon,
		label: 'Messages',
		link: linkOptions({
			to: '/messages',
		}),
	},
	{
		key: 'notifications',
		icon: BellIcon,
		label: 'Notifications',
		link: linkOptions({
			to: '/notifications',
		}),
	},
];

export function Links() {
	const ctx = useNotificationsContext();

	return (
		<div className="relative flex items-center gap-2">
			{items.map(({ key, ...item }) => (
				<div key={item.link.to}>
					{key === 'notifications' && ctx.unreadCount !== 0 && (
						<Badge className="absolute -right-3 -bottom-3 rounded-full text-xs">
							{ctx.unreadCount > 10 ? '+' : ctx.unreadCount}
						</Badge>
					)}
					<IconLink {...item} />
				</div>
			))}
		</div>
	);
}
