import { Link, type LinkOptions, linkOptions } from '@tanstack/react-router';
import {
	BellIcon,
	InboxIcon,
	Settings2Icon,
	SparklesIcon,
	UserIcon,
} from 'lucide-react';

type Item = {
	text: string;
	link: LinkOptions;
	icon: typeof UserIcon;
};

const links = [
	{
		text: 'Account',
		link: linkOptions({
			to: '/settings/account',
		}),
		icon: Settings2Icon,
	},
	{
		text: 'Profile',
		link: linkOptions({
			to: '/settings/profile',
		}),
		icon: UserIcon,
	},
	{
		text: 'Notifications',
		link: linkOptions({
			to: '/settings/notifications',
		}),
		icon: BellIcon,
	},
	{
		text: 'Chat',
		link: linkOptions({
			to: '/settings/chat',
		}),
		icon: InboxIcon,
	},
	{
		text: 'Preferences',
		link: linkOptions({
			to: '/settings/preferences',
		}),
		icon: SparklesIcon,
	},
] as const satisfies Item[];

export function Sidebar() {
	return (
		<nav className="grid gap-4 text-muted-foreground text-sm md:gap-10">
			{links.map((el) => (
				<SItem item={el} key={el.link.to} />
			))}
		</nav>
	);
}

function SItem({ item }: { item: Item }) {
	return (
		<Link
			{...item.link}
			className="flex items-center gap-2 rounded-md p-4 md:-m-4"
			activeProps={{
				className: 'font-semibold bg-muted',
			}}
		>
			<item.icon />
			{item.text}
		</Link>
	);
}
