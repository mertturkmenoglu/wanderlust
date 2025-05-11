import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ComponentIcon,
  LibraryIcon,
  MapIcon,
  MapPinnedIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';

export const Route = createFileRoute('/_admin/dashboard/')({
  component: RouteComponent,
});

type TIcon = typeof ComponentIcon;

type ItemProps = {
  href: string;
  text: string;
  icon: TIcon;
};

function Item({ href, text, icon: Icon }: ItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-2 text-muted-foreground justify-center rounded',
        'border border-border h-16 hover:border-primary hover:text-primary',
      )}
    >
      <Icon className="size-4" />
      <span className="text-balance text-center">{text}</span>
    </Link>
  );
}

function RouteComponent() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-96">
      <Item href="/dashboard/amenities" text="Amenities" icon={ComponentIcon} />
      <Item href="/dashboard/categories" text="Categories" icon={TagIcon} />
      <Item href="/dashboard/cities" text="Cities" icon={MapIcon} />
      <Item
        href="/dashboard/pois"
        text="Points of Interest"
        icon={MapPinnedIcon}
      />
      <Item href="/dashboard/users" text="Users" icon={UsersIcon} />
      <Item
        href="/dashboard/collections"
        text="Collections"
        icon={LibraryIcon}
      />
    </div>
  );
}
