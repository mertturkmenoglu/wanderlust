import { citiesCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import DashboardActions from '../-dashboard-actions';
import DashboardBreadcrumb from '../-dashboard-breadcrumb';

export const Route = createFileRoute('/_admin/dashboard/cities/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/cities/'),
    ),
});

function RouteComponent() {
  const { cities } = Route.useLoaderData();

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Cities', href: '/dashboard/cities' }]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/cities/new"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          New City
        </Link>
      </DashboardActions>

      <DataTable
        columns={citiesCols}
        filterColumnId="name"
        data={cities.map((city) => ({
          id: city.id,
          name: city.name,
          stateName: city.state.name,
          stateCode: city.state.code,
          countryName: city.country.name,
          countryCode: city.country.code,
        }))}
        hrefPrefix="/dashboard/cities"
      />
    </div>
  );
}
