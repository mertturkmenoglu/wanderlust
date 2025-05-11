import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { poisCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = api.useQuery('get', '/api/v2/pois/peek');

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Point of Interests', href: '/dashboard/pois' }]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/pois/drafts"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          Drafts
        </Link>
      </DashboardActions>

      {query.data?.pois && (
        <DataTable
          columns={poisCols}
          filterColumnId="name"
          data={query.data.pois.map((poi) => ({
            id: poi.id,
            name: poi.name,
            addressId: poi.addressId,
            categoryId: poi.categoryId,
          }))}
          hrefPrefix="/dashboard/pois"
        />
      )}
    </div>
  );
}
