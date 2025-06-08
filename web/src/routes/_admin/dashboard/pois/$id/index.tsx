import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

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
        src={ipx(poi.images[0]?.url ?? '', 'w_512')}
        alt={poi.images[0]?.alt}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex flex-col gap-2 mt-2">
        <DataTable
          columns={keyValueCols}
          filterColumnId=""
          data={[
            {
              k: 'ID',
              v: poi.id,
            },
            {
              k: 'Name',
              v: poi.name,
            },
            {
              k: 'Phone',
              v: poi.phone ?? '-',
            },
            {
              k: 'Description',
              v: poi.description,
            },
            {
              k: 'Address ID',
              v: `${poi.addressId}`,
            },
            {
              k: 'Website',
              v: poi.website ?? '-',
            },
            {
              k: 'Price Level',
              v: `${poi.priceLevel}`,
            },
            {
              k: 'Accessibility Level',
              v: `${poi.accessibilityLevel}`,
            },
            {
              k: 'Total Votes',
              v: `${poi.totalVotes}`,
            },
            {
              k: 'Total Points',
              v: `${poi.totalPoints}`,
            },
            {
              k: 'Total Favorites',
              v: `${poi.totalFavorites}`,
            },
            {
              k: 'Category ID',
              v: `${poi.categoryId}`,
            },
            {
              k: 'Hours',
              v: Object.keys(poi.hours).join(', ').toUpperCase(),
            },
            {
              k: 'Created At',
              v: `${formatDistanceToNow(new Date(poi.createdAt))} ago`,
            },
            {
              k: 'Updated At',
              v: `${formatDistanceToNow(new Date(poi.updatedAt))} ago`,
            },
            {
              k: 'Total Amenities',
              v: `${poi.amenities.length}`,
            },
            {
              k: 'Total Media',
              v: `${poi.images.length}`,
            },
            {
              k: 'Address',
              v: JSON.stringify(poi.address, null, 2),
            },
          ]}
        />
      </div>
    </div>
  );
}
