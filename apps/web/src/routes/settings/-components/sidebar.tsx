import {
	Link,
	type LinkOptions,
	linkOptions,
	useMatches,
} from '@tanstack/react-router';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wanderlust/ui/components/collapsible';
import {
	BellIcon,
	ChevronDownIcon,
	Settings2Icon,
	UserIcon,
	InboxIcon,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
] as const satisfies Item[];

export function Sidebar() {
	const isMobile = useIsMobile();
	const matches = useMatches();

	if (isMobile) {
		const lastMatch = matches.at(-1);

		if (!lastMatch) {
			return null;
		}

		const currentLink = links.find(
			(link) =>
				link.link.to === lastMatch.pathname ||
				link.link.to === lastMatch.pathname.substring(0, link.link.to.length),
		);

		if (!currentLink) {
			return null;
		}

		return (
			<Collapsible>
				<CollapsibleTrigger className="group w-full">
					<div className="flex items-center gap-2 rounded-md bg-muted p-4 font-semibold">
						<currentLink.icon />
						{currentLink.text}
						<ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent className="mt-4">
					<nav className="grid text-muted-foreground text-sm md:gap-10">
						{links.map((el) => (
							<SItem item={el} key={el.link.to} />
						))}
					</nav>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<nav className="grid gap-10 text-muted-foreground text-sm">
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
