import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/categories/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/categories/'),
    ),
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();

  return (
    <div>
      <BackLink href="/dashboard" text="Go back to dashboard" />

      <div className="flex items-baseline gap-8 mt-4">
        <h3 className="text-lg font-bold tracking-tight">Categories</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/categories/new">New Category</Link>
        </Button>
      </div>

      {categories.length === 0 && (
        <AppMessage
          emptyMessage="No amenities found"
          showBackButton={false}
          className="mt-8"
        />
      )}
      <div className="">
        <DataTable
          columns={keyValueCols}
          filterColumnId="name"
          data={categories.map((c) => ({
            k: `${c.id}`,
            v: c.name,
          }))}
          hrefPrefix="/dashboard/categories"
          hrefColumnId="k"
        />
      </div>
    </div>
  );
}
