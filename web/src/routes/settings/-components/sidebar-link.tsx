import { Link } from '@tanstack/react-router';
import { type Item } from './items';

type SidebarLinkProps = Item;

export default function SidebarLink({ text, href }: SidebarLinkProps) {
  return (
    <Link
      to={href}
      activeProps={{
        className: 'font-semibold text-primary',
      }}
      className="hover:underline"
    >
      {text}
    </Link>
  );
}
