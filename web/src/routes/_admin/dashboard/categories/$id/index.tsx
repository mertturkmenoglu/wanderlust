import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import DeleteDialog from '@/components/blocks/dashboard/delete-dialog';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

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
  const category = categories.find((category) => category.id === +id)!;
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const deleteMutation = api.useMutation('delete', '/api/v2/categories/{id}', {
    onSuccess: async () => {
      toast.success('Category deleted');
      await invalidator.invalidate();
      await navigate({ to: '/dashboard/categories' });
    },
  });

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
              buttonVariants({ variant: 'outline', size: 'sm' }),
              '',
            )}
          >
            Edit
          </Link>

          <DeleteDialog
            type="category"
            onClick={() =>
              deleteMutation.mutate({ params: { path: { id: category.id } } })
            }
          />
        </div>
      </DashboardActions>

      <img
        src={ipx(category.image, 'w_512')}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <DataTable
        columns={keyValueCols}
        filterColumnId=""
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
