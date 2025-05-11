import { getRouteApi } from '@tanstack/react-router';
import { items } from './items';
import SidebarLink from './sidebar-link';

export default function Sidebar() {
  const parentRoute = getRouteApi('/settings');
  const { auth } = parentRoute.useRouteContext();

  const showDashboardLink = auth.user?.role === 'admin';
  const filtered = items.filter((x) => x.href !== '/dashboard');
  const links = showDashboardLink ? items : filtered;

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((el) => (
        <SidebarLink text={el.text} href={el.href} key={el.href} />
      ))}
    </nav>
  );
}
