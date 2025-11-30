import { Link } from '@tanstack/react-router';
import { authClient } from '@/lib/auth';

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
	const session = authClient.useSession();

	const links = items.filter((x) => {
		const protectedRoutes = ['/admin', '/dashboard'];

		if (!protectedRoutes.includes(x.href)) {
			return true;
		}

		if (x.href === '/admin') {
			return isDev && session.data?.user.role === 'admin';
		}

		if (x.href === '/dashboard') {
			return auth.user?.role === 'admin';
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
