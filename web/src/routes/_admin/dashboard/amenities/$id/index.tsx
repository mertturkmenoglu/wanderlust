import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import DeleteDialog from '@/components/blocks/dashboard/delete-dialog';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_admin/dashboard/amenities/$id/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/amenities/'),
    ),
});

function RouteComponent() {
  const { amenities } = Route.useLoaderData();
  const { id } = Route.useParams();
  const amenity = amenities.find((amenity) => amenity.id === +id);
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const deleteMutation = api.useMutation('delete', '/api/v2/amenities/{id}', {
    onSuccess: async () => {
      toast.success('Amenity deleted');
      await invalidator.invalidate();
      await navigate({ to: '/dashboard/amenities' });
    },
  });

  if (!amenity) {
    throw new Response('Amenity not found', { status: 404 });
  }

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Amenities', href: '/dashboard/amenities' },
          {
            name: amenity.name,
            href: `/dashboard/amenities/${amenity.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            to="/dashboard/amenities/$id/edit"
            params={{
              id,
            }}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Edit
          </Link>

          <DeleteDialog
            type="amenity"
            onClick={() =>
              deleteMutation.mutate({
                params: {
                  path: {
                    id: amenity.id,
                  },
                },
              })
            }
          />
        </div>
      </DashboardActions>

      <DataTable
        columns={keyValueCols}
        filterColumnId=""
        data={[
          {
            k: 'ID',
            v: `${amenity.id}`,
          },
          {
            k: 'Name',
            v: amenity.name,
          },
        ]}
      />
    </div>
  );
}
