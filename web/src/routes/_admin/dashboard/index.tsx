import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArchiveIcon,
  ClipboardListIcon,
  ComponentIcon,
  LibraryIcon,
  MapIcon,
  MapPinnedIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { Item } from './-item';

export const Route = createFileRoute('/_admin/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashboardBreadcrumb items={[{ name: 'Home', href: '/dashboard' }]} />

      <Separator className="my-2" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-96">
        <Item
          href="/dashboard/amenities"
          text="Amenities"
          icon={ComponentIcon}
        />

        <Item
          href="/dashboard/categories"
          text="Categories"
          icon={TagIcon}
        />

        <Item
          href="/dashboard/cities"
          text="Cities"
          icon={MapIcon}
        />

        <Item
          href="/dashboard/pois"
          text="Points of Interest"
          icon={MapPinnedIcon}
        />

        <Item
          href="/dashboard/users"
          text="Users"
          icon={UsersIcon}
        />

        <Item
          href="/dashboard/collections"
          text="Collections"
          icon={LibraryIcon}
        />

        <Item
          href="/dashboard/reports"
          text="Reports"
          icon={ClipboardListIcon}
        />

        <Item
          href="/dashboard/exports"
          text="Exports"
          icon={ArchiveIcon}
        />
      </div>
    </div>
  );
}
