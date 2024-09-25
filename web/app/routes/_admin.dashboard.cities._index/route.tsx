import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { citiesCols } from "~/components/blocks/dashboard/columns";
import { DataTable } from "~/components/blocks/dashboard/data-table";
import { getCities } from "~/lib/api";

export async function loader() {
  const cities = await getCities();
  return json({ cities: cities.data.cities });
}

export default function Page() {
  const { cities } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="mb-8 text-lg font-bold tracking-tight">Cities</h3>
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
