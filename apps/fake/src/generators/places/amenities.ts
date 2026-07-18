import { faker } from '@faker-js/faker';
import { data } from '@/fixtures/amenities';
import { rngSuffix } from './suffix';

export function generateAmenities(): string[] {
	return faker.helpers
		.arrayElements(data, { min: 5, max: 25 })
		.map((a) => rngSuffix(a));
}
