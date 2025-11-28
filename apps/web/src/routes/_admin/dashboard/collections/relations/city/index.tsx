import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_admin/dashboard/collections/relations/city/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: 'Collection - City Relations',
            href: '/dashboard/collections/relations/city',
          },
        ]}
      />

      <Separator className="my-2" />

      <div>Collection - City Relations</div>
    </div>
  );
}
