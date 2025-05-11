import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/{id}', {
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
  const { poi } = Route.useLoaderData();

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Point of Interests', href: '/dashboard/pois' },
          {
            name: poi.name,
            href: `/dashboard/pois/${poi.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2">
          <Link
            to="/p/$id"
            params={{
              id: poi.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Visit Page
          </Link>

          <Link
            to="/dashboard/pois/$id/edit"
            params={{
              id: poi.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Edit
          </Link>
        </div>
      </DashboardActions>

      <img
        src={ipx(poi.media[0]?.url ?? '', 'w_512')}
        alt={poi.media[0]?.alt}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex flex-col gap-2 mt-2">
        <div className="font-semibold">All Details:</div>
        <pre className="max-w-3xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
