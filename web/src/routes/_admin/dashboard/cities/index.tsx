import { citiesCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

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
      <div className="flex items-baseline gap-8 mb-8">
        <h3 className="text-lg font-bold tracking-tight">Cities</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/cities/new">New City</Link>
        </Button>
      </div>

      <DataTable
        columns={citiesCols}
        data={cities.map((city) => ({
          id: city.id,
          name: city.name,
          stateName: city.state.name,
          countryName: city.country.name,
        }))}
        hrefPrefix="/dashboard/cities"
      />
    </div>
  );
}
