import { Link } from "react-router";
import { citiesCols } from "~/components/blocks/dashboard/columns";
import { DataTable } from "~/components/blocks/dashboard/data-table";
import { Button } from "~/components/ui/button";
import { getCities } from "~/lib/api";
import type { Route } from "./+types/route";

export async function loader() {
  const cities = await getCities();
  return { cities: cities.data.cities };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { cities } = loaderData;

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
          stateName: city.stateName,
          countryName: city.countryName,
        }))}
        hrefPrefix="/dashboard/cities"
      />
    </div>
  );
}
