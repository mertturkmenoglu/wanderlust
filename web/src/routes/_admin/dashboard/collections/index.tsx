import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { collectionsCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/collections/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/'),
    );
  },
});

function shortDescription(str: string) {
  if (str.length > 64) {
    return str.slice(0, 64) + '...';
  }

  return str;
}

function RouteComponent() {
  const { collections } = Route.useLoaderData();

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Collections', href: '/dashboard/collections' }]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/collections/new"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            New Collection
          </Link>

          <Link
            to="/dashboard/collections/relations/poi"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            POI Relations
          </Link>

          <Link
            to="/dashboard/collections/relations/city"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            City Relations
          </Link>
        </div>
      </DashboardActions>

      <DataTable
        columns={collectionsCols}
        filterColumnId="name"
        data={collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          description: shortDescription(collection.description),
          createdAt: new Date(collection.createdAt).toLocaleDateString(),
        }))}
        hrefPrefix="/dashboard/collections"
      />
    </div>
  );
}
