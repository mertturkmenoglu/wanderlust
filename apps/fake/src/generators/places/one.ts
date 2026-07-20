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

export function generateOne(
	categoryIds: string[],
	cities: {
		id: string;
		name: string;
		stateCode: string;
		stateName: string;
		countryCode: string;
		countryName: string;
		lat: number;
		lng: number;
	}[],
): Insert {
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

	const city = faker.helpers.arrayElement(cities);

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

	const coord = faker.location.nearbyGPSCoordinate({
		isMetric: true,
		origin: [city.lat, city.lng],
		radius: 50,
	});

	const state = faker.location.state({ abbreviated: true });
	const stateFull = faker.location.state();

	const votes = faker.number.int({ min: 0, max: 1_000 });
	const points = faker.number.int({ min: votes, max: 5_000 * votes });

	return {
		id: nanoid(),
		name: faker.lorem.sentence({ min: 2, max: 6 }).replace('.', ''),
		description: faker.lorem.paragraphs({ min: 1, max: 8 }),
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
		totalVotes: votes,
		totalFavorites: faker.number.int({ min: 0, max: 1_000 }),
		totalPoints: points,
		accessibilityOptions: a11yOpts,
		countryCode: city.countryCode,
		countryName: city.countryName,
		adminAreaCode: state,
		adminAreaName: stateFull,
		locality: city.name,
		subLocality: faker.location.county(),
		postalCode: faker.location.zipCode(),
		addressLine: faker.location.streetAddress(),
		lat: coord[0],
		lng: coord[1],
		wlCityId: city.id,
	};
}
