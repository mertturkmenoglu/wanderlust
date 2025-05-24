import { getRouteApi, Link } from '@tanstack/react-router';

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

export default function Sidebar() {
  const parentRoute = getRouteApi('/settings');
  const { auth } = parentRoute.useRouteContext();
  const isDev = import.meta.env.DEV;

  const showDashboardLink = auth.user?.role === 'admin';
  const links = items.filter((x) => {
    if (x.href === '/admin' && !isDev) {
      return false;
    }

    if (x.href === '/dashboard' && !showDashboardLink) {
      return false;
    }

    return true;
  });

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
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
