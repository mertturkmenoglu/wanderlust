import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import OverlayBanner from "~/components/blocks/overlay-banner";
import Spinner from "~/components/kit/spinner";
import { Button } from "~/components/ui/button";
import { getCities } from "~/lib/api";
import { GetCityByIdResponseDto } from "~/lib/dto";

export default function ListCities() {
  const query = useQuery({
    queryKey: ["cities"],
    queryFn: async () => getCities(),
  });

  const groups = useMemo(() => {
    if (query.data) {
      return groupCitiesByCountry(query.data.data.cities);
    }

    return [];
  }, [query.data]);

  if (query.isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <OverlayBanner
        image="https://images.unsplash.com/photo-1607388510015-c632e99da586?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Categories Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Discover the world around you</div>
            <Button asChild variant="default">
              <Link to="/categories">See categories</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <div className="flex items-baseline">
        <h2 className="text-4xl font-bold">Browse by country</h2>
      </div>

      <div className="my-8">
        {groups.map((group) => (
          <div key={group[0]} className="my-8">
            <h3 className="text-2xl font-bold">{group[0]}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {group[1].map((city) => (
                <a
                  href={`/cities/${city.id}/${city.name}`}
                  key={city.id}
                  className="rounded-md"
                >
                  <img
                    src={city.imageUrl}
                    alt=""
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <div className="mt-2 text-xl font-bold lg:text-base">
                    {city.name}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupCitiesByCountry(cities: GetCityByIdResponseDto[]) {
  const countries = new Map<string, GetCityByIdResponseDto[]>();

  cities.forEach((city) => {
    const country = city.countryName;
    if (!countries.has(country)) {
      countries.set(country, []);
    }
    countries.get(country)?.push(city);
  });

  const countriesArray = Array.from(countries.entries());
  countriesArray.sort((a, b) => a[0].localeCompare(b[0]));

  return countriesArray;
}
