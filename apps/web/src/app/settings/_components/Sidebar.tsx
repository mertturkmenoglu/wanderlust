import { canAccessOrg } from '@/lib/org-access';
import SidebarLink from './SidebarLink';
import { items } from './items';

type Props = {};

function Sidebar({}: Props): React.ReactElement {
  const showDashboardLink = canAccessOrg();
  const filtered = items.filter((x) => x.href !== '/dashboard');
  const links = showDashboardLink ? items : filtered;

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((el) => (
        <SidebarLink
          text={el.text}
          href={el.href}
          key={el.href}
        />
      ))}
    </nav>
  );
}

export default Sidebar;
