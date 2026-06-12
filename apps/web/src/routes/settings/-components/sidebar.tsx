import { Link, type LinkOptions, linkOptions } from '@tanstack/react-router';

type Item = {
	text: string;
	link: LinkOptions;
};

const links = [
	{
		text: 'Account',
		link: linkOptions({
			to: '/settings/account',
		}),
	},
	{
		text: 'Profile',
		link: linkOptions({
			to: '/settings/profile',
		}),
	},
	{
		text: 'Notifications',
		link: linkOptions({
			to: '/settings/notifications',
		}),
	},
] as const satisfies Item[];

export function Sidebar() {
	return (
		<nav className="grid gap-4 text-muted-foreground text-sm">
			{links.map((el) => (
				<Link
					{...el.link}
					key={el.link.to}
					activeProps={{
						className: 'font-semibold text-primary',
					}}
					className="hover:underline"
				>
					{el.text}
				</Link>
			))}
		</nav>
	);
}
