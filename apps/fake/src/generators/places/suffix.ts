import { faker } from '@faker-js/faker';

export function rngSuffix(s: string): string {
	return `${s}.${faker.helpers.arrayElement(['0', '1'])}`;
}
