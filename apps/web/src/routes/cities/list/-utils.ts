import type { components } from '@/lib/api-types';

type TCity = components['schemas']['City'];
type TCities = TCity[];

export function groupCitiesByCountry(cities: TCities) {
  const countries = new Map<string, TCity[]>();

  for (const city of cities) {
    const country = city.country.name;
    if (!countries.has(country)) {
      countries.set(country, []);
    }
    countries.get(country)?.push(city);
  }

  const countriesArray = [...countries.entries()];
  countriesArray.sort((a, b) => a[0].localeCompare(b[0]));

  return countriesArray;
}
