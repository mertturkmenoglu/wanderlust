import AppMessage from '@/components/blocks/app-message';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import DashboardActions from '../../../../../components/blocks/dashboard/actions';
import DashboardBreadcrumb from '../../../../../components/blocks/dashboard/breadcrumb';
import DeleteDialog from './-delete-dialog';

export const Route = createFileRoute('/_admin/dashboard/categories/$id/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/categories/'),
    ),
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const { id } = Route.useParams();
  const category = categories.find((category) => category.id === +id);

  if (!category) {
    return (
      <AppMessage errorMessage="Category not found" showBackButton={false} />
    );
  }

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Categories', href: '/dashboard/categories' },
          {
            name: category.name,
            href: `/dashboard/categories/${category.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            to="/dashboard/categories/$id/edit"
            params={{
              id,
            }}
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              '',
            )}
          >
            Edit
          </Link>

          <DeleteDialog id={category.id} />
        </div>
      </DashboardActions>

      <img
        src={category.image}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <DataTable
        columns={keyValueCols}
        filterColumnId="k"
        data={[
          {
            k: 'ID',
            v: `${category.id}`,
          },
          {
            k: 'Name',
            v: category.name,
          },
          {
            k: 'Image URL',
            v: category.image,
          },
        ]}
      />
    </div>
  );
}
