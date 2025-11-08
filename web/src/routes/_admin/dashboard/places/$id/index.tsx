import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/_admin/dashboard/places/$id/')({
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

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Places', href: '/dashboard/places' },
          {
            name: place.name,
            href: `/dashboard/places/${place.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2">
          <Link
            to="/p/$id"
            params={{
              id: place.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Visit Page
          </Link>

          <Link
            to="/dashboard/places/$id/edit"
            params={{
              id: place.id,
            }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Edit
          </Link>
        </div>
      </DashboardActions>

      <img
        src={ipx(place.assets[0]?.url ?? '', 'w_512')}
        alt={place.assets[0]?.description ?? ''}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex flex-col gap-2 mt-2">
        <DataTable
          columns={keyValueCols}
          filterColumnId=""
          data={[
            {
              k: 'ID',
              v: place.id,
            },
            {
              k: 'Name',
              v: place.name,
            },
            {
              k: 'Phone',
              v: place.phone ?? '-',
            },
            {
              k: 'Description',
              v: place.description,
            },
            {
              k: 'Address ID',
              v: `${place.addressId}`,
            },
            {
              k: 'Website',
              v: place.website ?? '-',
            },
            {
              k: 'Price Level',
              v: `${place.priceLevel}`,
            },
            {
              k: 'Accessibility Level',
              v: `${place.accessibilityLevel}`,
            },
            {
              k: 'Total Votes',
              v: `${place.totalVotes}`,
            },
            {
              k: 'Total Points',
              v: `${place.totalPoints}`,
            },
            {
              k: 'Total Favorites',
              v: `${place.totalFavorites}`,
            },
            {
              k: 'Category ID',
              v: `${place.categoryId}`,
            },
            {
              k: 'Hours',
              v: Object.keys(place.hours).join(', ').toUpperCase(),
            },
            {
              k: 'Created At',
              v: `${formatDistanceToNow(new Date(place.createdAt))} ago`,
            },
            {
              k: 'Updated At',
              v: `${formatDistanceToNow(new Date(place.updatedAt))} ago`,
            },
            {
              k: 'Total Amenities',
              v: `${place.amenities.length}`,
            },
            {
              k: 'Total Media',
              v: `${place.assets.length}`,
            },
            {
              k: 'Address',
              v: JSON.stringify(place.address, null, 2),
            },
          ]}
        />
      </div>
    </div>
  );
}
