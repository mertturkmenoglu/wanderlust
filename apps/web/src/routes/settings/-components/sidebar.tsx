import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

type Item = {
	text: string;
	href: string;
};

const items = [
	{
		text: 'Account',
		href: '/settings/account',
	},
	{
		text: 'Profile',
		href: '/settings/profile',
	},
	{
		text: 'Dashboard',
		href: '/dashboard',
	},
	{
		text: 'Admin Tools',
		href: '/admin',
	},
] as const satisfies Item[];

export function Sidebar() {
	const isDev = import.meta.env.DEV;
	const {
		data: { role },
	} = useSuspenseQuery(
		orpc.users.getRole.queryOptions({
			input: {},
		}),
	);

	const links = items.filter((x) => {
		const protectedRoutes = ['/admin', '/dashboard'];

		if (!protectedRoutes.includes(x.href)) {
			return true;
		}

		if (x.href === '/admin') {
			return isDev && role === 'admin';
		}

		if (x.href === '/dashboard') {
			return role === 'admin';
		}

		return false;
	});

	return (
		<nav className="grid gap-4 text-muted-foreground text-sm">
			{links.map((el) => (
				<Link
					to={el.href}
					activeProps={{
						className: 'font-semibold text-primary',
					}}
					className="hover:underline"
					key={el.href}
				>
					{el.text}
				</Link>
			))}
		</nav>
	);
}
