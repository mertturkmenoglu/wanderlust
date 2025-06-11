import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Spinner } from '@/components/kit/spinner';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit')({
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
  const id = poi.id;

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Point of Interests', href: '/dashboard/pois' },
          {
            name: poi.name,
            href: `/dashboard/pois/${poi.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/pois/${poi.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <div className="mt-4 flex items-center gap-4">
        <Link
          to="/dashboard/pois/$id/edit"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Info</div>
        </Link>

        <Link
          to="/dashboard/pois/$id/edit/address"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Address</div>
        </Link>

        <Link
          to="/dashboard/pois/$id/edit/amenities"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Amenities</div>
        </Link>

        <Link
          to="/dashboard/pois/$id/edit/hours"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Hours</div>
        </Link>

        <Link
          to="/dashboard/pois/$id/edit/images"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Media</div>
        </Link>
      </div>

      <Suspense
        fallback={
          <div>
            <Spinner className="size-8 mx-auto my-16" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
