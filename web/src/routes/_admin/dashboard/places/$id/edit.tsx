import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/places/$id/edit')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/places/{id}', {
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
  const { place } = Route.useLoaderData();
  const id = place.id;

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Places', href: '/dashboard/places' },
          {
            name: place.name,
            href: `/dashboard/places/${place.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/places/${place.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <div className="mt-4 flex items-center gap-4">
        <Link
          to="/dashboard/places/$id/edit"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), 'px-0!')}
        >
          <div>Edit Info</div>
        </Link>

        <Link
          to="/dashboard/places/$id/edit/address"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), 'px-0!')}
        >
          <div>Edit Address</div>
        </Link>
      </div>

      <SuspenseWrapper>
        <Outlet />
      </SuspenseWrapper>
    </div>
  );
}
