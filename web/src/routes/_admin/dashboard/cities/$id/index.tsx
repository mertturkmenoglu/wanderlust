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

export const Route = createFileRoute('/_admin/dashboard/cities/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/cities/{id}', {
        params: {
          path: {
            id: +params.id,
          },
        },
      }),
    ),
});

function RouteComponent() {
  const city = Route.useLoaderData();
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const mutation = api.useMutation('delete', '/api/v2/cities/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      await navigate({ to: '/dashboard/cities' });
      toast.success('City deleted');
    },
  });

  return (
    <>
      <DashboardBreadcrumb
        items={[
          { name: 'Cities', href: '/dashboard/cities' },
          {
            name: city.name,
            href: `/dashboard/cities/${city.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            to="/cities/$"
            params={{
              _splat: `${city.id}`,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Visit Page
          </Link>

          <Link
            to="/dashboard/cities/$id/edit"
            params={{
              id: `${city.id}`,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Edit
          </Link>

          <DeleteDialog
            type="city"
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id: city.id,
                  },
                },
              })
            }
          />
        </div>
      </DashboardActions>

      <img
        src={ipx(city.image.url, 'w_512')}
        alt={city.name}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <DataTable
        columns={keyValueCols}
        filterColumnId="key"
        data={[
          {
            k: 'ID',
            v: `${city.id}`,
          },
          {
            k: 'Name',
            v: city.name,
          },
          {
            k: 'State Code',
            v: city.state.code,
          },
          {
            k: 'State Name',
            v: city.state.name,
          },
          {
            k: 'Country Code',
            v: city.country.code,
          },
          {
            k: 'Country Name',
            v: city.country.name,
          },
          {
            k: 'Image License',
            v: city.image.license ?? '-',
          },
          {
            k: 'Image License Link',
            v: city.image.licenseLink ?? '-',
          },
          {
            k: 'Image Attribution',
            v: city.image.attribution ?? '-',
          },
          {
            k: 'Image Attribution Link',
            v: city.image.attributionLink ?? '-',
          },
        ]}
      />
    </>
  );
}
