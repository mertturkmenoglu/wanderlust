import BackLink from '@/components/blocks/back-link';
import { poisCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = api.useQuery('get', '/api/v2/pois/peek');

  return (
    <div>
      <BackLink href="/dashboard" text="Go back to dashboard" />

      <div className="flex items-baseline gap-8 mt-4">
        <h3 className="text-lg font-bold tracking-tight">Point of Interests</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/pois/drafts">Drafts</Link>
        </Button>
      </div>

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
