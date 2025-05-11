import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
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
    <>
      <DashboardBreadcrumb
        items={[{ name: 'Categories', href: '/dashboard/categories' }]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/categories/new"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          New Category
        </Link>
      </DashboardActions>

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
    </>
  );
}
