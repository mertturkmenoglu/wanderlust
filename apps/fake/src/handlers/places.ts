import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { getDb } from './common';

const days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

const openings = ['07:00', '08:00', '09:00', '10:00', '11:00'];

const closings = ['17:00', '18:00', '19:00', '20:00', '21:00'];

function generateIntervals() {
	const intervals: { off: boolean; open: string; close: string }[] = [];

	const numIntervals = faker.helpers.weightedArrayElement([
		{ weight: 9, value: 1 },
		{ weight: 1, value: 2 },
	]);

	for (let i = 0; i < numIntervals; i++) {
		const o = faker.helpers.arrayElement(openings);
		const c = faker.helpers.arrayElement(closings);
		const off = faker.helpers.weightedArrayElement([
			{ weight: 95, value: false },
			{ weight: 5, value: true },
		]);

		intervals.push({ off, open: o, close: c });
	}

	return intervals;
}

function generateHours() {
	const selectedDays = faker.helpers.arrayElements(days, { min: 5, max: 7 });
	const hours: Record<string, string> = {};

	for (const day of days) {
		const o = faker.helpers.arrayElement(openings);
		const c = faker.helpers.arrayElement(closings);
		const str = `${o}-${c}`;
		hours[day] = str;
	}

	return {
		regular: days.map((day) => ({
			day,
			intervals: selectedDays.includes(day) ? generateIntervals() : [],
		})),
		special: [
			{
				rule: 'PH',
				intervals: generateIntervals(),
			},
		],
	};
}

const amenities = [
	'wifi',
	'freeParking',
	'paidParking',
	'wheelchair',
	'restrooms',
	'ac',
	'outdoor',
	'indoor',
	'bar',
	'pet',
	'kidsPlay',
	'driveThru',
	'loyalty',
	'allWeekService',
	'delivery',
	'vegan',
	'liveMusic',
	'privateRooms',
	'onlineOrdering',
	'evCharging',
	'selfService',
	'smoking',
	'guidedTours',
	'giftShop',
	'snackBar',
	'informationDesk',
	'specialExhibitions',
	'observationDecks',
	'atm',
	'photographyArea',
	'a11yServices',
	'studyRoom',
	'romanticAtmosphere',
	'familyFriendly',
	'concierge',
	'fitness',
	'spa',
	'workspaces',
	'groupActivities',
	'ecoFriendly',
	'publicTransportation',
	'garden',
	'complimentaryTasting',
	'gamingStations',
	'onlineReservation',
	'valetParking',
	'catering',
	'specialDietaryOptions',
	'childrensMenu',
	'wineList',
	'liveCookingStations',
	'happyHourSpecials',
	'chefsSpecials',
	'communalTables',
	'brunchOptions',
	'eventHosting',
];

function generateAmenities(): string[] {
	return faker.helpers
		.arrayElements(amenities, { min: 5, max: 25 })
		.map((a) => `${a}.${faker.helpers.arrayElement(['0', '1'])}`);
}

const COUNT = 2_000;
const STEP = 100;

type Insert = z.infer<typeof $insert.place>;

export async function generate() {
	let step = STEP;
	const db = await getDb();

	const allCategories = await db.query.categories.findMany({
		columns: {
			id: true,
		},
	});

	const categoryIds = allCategories.map((r) => r.id);

	if (categoryIds.length === 0) {
		throw new Error('No categories found. Generate categories first.');
	}

	const allCities = await db.query.cities.findMany({
		columns: {
			id: true,
		},
	});

	const cityIds = allCities.map((r) => r.id);

	if (cityIds.length === 0) {
		throw new Error('No cities found. Generate cities first.');
	}

	for (let i = 0; i < COUNT; i += step) {
		if (i + step > COUNT) {
			step = COUNT - i;
		}

		const batch: Insert[] = [];

		for (let j = 0; j < step; j++) {
			batch.push({
				id: nanoid(),
				name: faker.lorem.sentence({ min: 2, max: 6 }).replace('.', ''),
				description: faker.lorem.paragraphs({ min: 1, max: 3 }),
				status: faker.helpers.arrayElement([
					'unknown',
					'operational',
					'closed_temp',
					'closed_perm',
					'future',
				]),
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
				priceLevel: faker.helpers.arrayElement([
					'unknown',
					'free',
					'cheap',
					'moderate',
					'expensive',
					'very_expensive',
				]),
				accessibilityLevel: faker.helpers.arrayElement([
					'unknown',
					'not_accessible',
					'partially_accessible',
					'highly_accessible',
				]),
				openingHours: generateHours(),
				amenities: generateAmenities(),
				paymentOptions: faker.helpers.multiple(
					() =>
						`${faker.helpers.arrayElement(['cash', 'cc', 'mobile'])}.${faker.helpers.arrayElement(['0', '1'])}`,
					{
						count: { min: 1, max: 3 },
					},
				),
				parkingOptions: faker.helpers.multiple(
					() =>
						`${faker.helpers.arrayElement([
							'free_street',
							'paid_street',
							'free_lot',
							'paid_lot',
							'valet',
							'free_garage',
							'paid_garage',
						])}.${faker.helpers.arrayElement(['0', '1'])}`,
					{
						count: { min: 1, max: 3 },
					},
				),
				accessibilityOptions: faker.helpers.multiple(
					() =>
						`${faker.helpers.arrayElement([
							'parking',
							'entrance',
							'restroom',
							'seating',
						])}.${faker.helpers.arrayElement(['0', '1'])}`,
					{
						count: { min: 1, max: 3 },
					},
				),
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
			});
		}

		await db.insert(schema.places).values(batch);
	}
}
