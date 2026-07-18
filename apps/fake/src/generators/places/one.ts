import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { nanoid } from '@wanderlust/uid';
import { generateAmenities } from './amenities';
import { generateHours } from './hours';
import { rngSuffix } from './suffix';

type Insert = Types.Places.$Insert.Place;

const status = [
	'unknown',
	'operational',
	'closed_temp',
	'closed_perm',
	'future',
] as const;

const price = [
	'unknown',
	'free',
	'cheap',
	'moderate',
	'expensive',
	'very_expensive',
] as const;

const a11y = [
	'unknown',
	'not_accessible',
	'partially_accessible',
	'highly_accessible',
] as const;

export function generateOne(categoryIds: string[], cityIds: string[]): Insert {
	const payment = faker.helpers.multiple(
		() => rngSuffix(faker.helpers.arrayElement(['cash', 'cc', 'mobile'])),
		{
			count: { min: 1, max: 3 },
		},
	);

	const parking = faker.helpers.multiple(
		() =>
			rngSuffix(
				faker.helpers.arrayElement([
					'free_street',
					'paid_street',
					'free_lot',
					'paid_lot',
					'valet',
					'free_garage',
					'paid_garage',
				]),
			),
		{
			count: { min: 1, max: 3 },
		},
	);

	const a11yOpts = faker.helpers.multiple(
		() =>
			rngSuffix(
				faker.helpers.arrayElement([
					'parking',
					'entrance',
					'restroom',
					'seating',
				]),
			),
		{
			count: { min: 1, max: 3 },
		},
	);

	return {
		id: nanoid(),
		name: faker.lorem.sentence({ min: 2, max: 6 }).replace('.', ''),
		description: faker.lorem.paragraphs({ min: 1, max: 5 }),
		status: faker.helpers.arrayElement(status),
		intlPhone: faker.phone.number({
			style: 'international',
		}),
		websites: faker.helpers.multiple(() => faker.internet.url(), {
			count: { min: 0, max: 2 },
		}),
		socials: faker.helpers.multiple(() => faker.internet.url(), {
			count: { min: 0, max: 2 },
		}),
		primaryCategoryId: faker.helpers.arrayElement(categoryIds),
		secondaryCategoryIds: faker.helpers.multiple(
			() => faker.helpers.arrayElement(categoryIds),
			{ count: { min: 0, max: 3 } },
		),
		priceLevel: faker.helpers.arrayElement(price),
		accessibilityLevel: faker.helpers.arrayElement(a11y),
		openingHours: generateHours(),
		amenities: generateAmenities(),
		paymentOptions: payment,
		parkingOptions: parking,
		accessibilityOptions: a11yOpts,
		countryCode: faker.location.countryCode('alpha-2'),
		countryName: faker.location.country(),
		adminAreaCode: faker.location.state({ abbreviated: true }),
		adminAreaName: faker.location.state(),
		locality: faker.location.city(),
		subLocality: faker.location.county(),
		postalCode: faker.location.zipCode(),
		addressLine: faker.location.streetAddress(),
		lat: faker.location.latitude(),
		lng: faker.location.longitude(),
		wlCityId: faker.helpers.arrayElement(cityIds),
	};
}
