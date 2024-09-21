import { GetCityByIdResponseDto } from '@/lib/dto';

export function groupCitiesByCountry(cities: GetCityByIdResponseDto[]) {
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
