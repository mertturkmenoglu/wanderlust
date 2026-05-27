import { linkOptions } from '@tanstack/react-router';
import { BellIcon, InboxIcon, SearchIcon } from 'lucide-react';
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

export function SignedInLinks() {
	return (
		<div className="flex items-center gap-2">
			{items.map((item) => (
				<IconLink {...item} />
			))}
		</div>
	);
}
