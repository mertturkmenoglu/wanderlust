import api from '@/lib/api';
import { GetCitiesResponseDto } from '@/lib/dto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCities() {
  return api.get('cities/').json<{ data: GetCitiesResponseDto }>();
}

function groupByCountry(cities: GetCitiesResponseDto['cities']) {
  const countries = new Map<string, GetCitiesResponseDto['cities']>();

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

export default async function Page() {
  const { data } = await getCities();
  const groups = groupByCountry(data.cities);

  return (
    <div className="container">
      <div className="flex items-baseline">
        <h2 className="mt-16 text-4xl font-bold">Browse by country</h2>
      </div>

      <div>
        {groups.map((group) => (
          <div key={group[0]}>
            <h3 className="mt-8 text-2xl font-bold">{group[0]}</h3>
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
