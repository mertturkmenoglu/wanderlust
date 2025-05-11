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

export const Route = createFileRoute('/_admin/dashboard/collections/$id/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { collection } = Route.useLoaderData();
  const invalidator = useInvalidator();
  const navigate = useNavigate();
  const mutation = api.useMutation('delete', '/api/v2/collections/{id}', {
    onSuccess: async () => {
      toast.success('Collection deleted');
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/collections',
      });
    },
    onError: async (e) => {
      toast.error(e.title ?? 'Something went wrong');
    },
  });

  const img = collection.items[0]?.poi.media[0] ?? { url: '', alt: '' };

  return (
    <>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: collection.name,
            href: `/dashboard/collections/${collection.id}`,
          },
        ]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            to="/c/$id"
            params={{
              id: collection.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Visit Page
          </Link>

          <Link
            to="/dashboard/collections/$id/edit"
            params={{
              id: collection.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Edit
          </Link>

          <Link
            to="/dashboard/collections/$id/items"
            params={{
              id: collection.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            See Collection Items
          </Link>

          <DeleteDialog
            type="collection"
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id: collection.id,
                  },
                },
              })
            }
          />
        </div>
      </DashboardActions>

      {img.url !== '' && (
        <img
          src={ipx(img.url, 'w_512')}
          alt={img.alt}
          className="mt-4 w-64 rounded-md aspect-video object-cover"
        />
      )}

      <DataTable
        columns={keyValueCols}
        filterColumnId="key"
        data={[
          {
            k: 'ID',
            v: collection.id,
          },
          {
            k: 'Name',
            v: collection.name,
          },
          {
            k: 'Description',
            v: collection.description,
          },
          {
            k: 'Created At',
            v: new Date(collection.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </>
  );
}
