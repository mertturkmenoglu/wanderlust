import type { Outputs } from '@/lib/orpc';

type TCity = Outputs['cities']['get']['city'];
type TCities = TCity[];

export function groupCitiesByCountry(cities: TCities) {
	const countries = new Map<string, TCity[]>();

	for (const city of cities) {
		const country = city.countryName;
		if (!countries.has(country)) {
			countries.set(country, []);
		}
		countries.get(country)?.push(city);
	}

	const countriesArray = [...countries.entries()];
	countriesArray.sort((a, b) => a[0].localeCompare(b[0]));

	return countriesArray;
}
