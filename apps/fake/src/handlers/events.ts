import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { getDb } from './common';

const ageRestrictions = ['4+', '9+', '13+', '16+', '18+', 'unrated'] as const;

const refundPolicies = [
	'full-refund',
	'partial-refund',
	'no-refund',
	'conditional',
	'unspecified',
] as const;

const recurrences = [
	'no-recurrence',
	'daily',
	'weekly',
	'monthly',
	'annually',
	'seasonal',
	'unspecified',
] as const;

const eventCategories = [
	'music',
	'art',
	'food',
	'tech',
	'sports',
	'film',
	'comedy',
	'theater',
	'dance',
	'festival',
	'conference',
	'networking',
	'wellness',
	'charity',
	'gaming',
	'fashion',
	'science',
	'literature',
	'outdoor',
	'family',
];

const eventAmenities = [
	'wifi',
	'parking',
	'wheelchair',
	'restrooms',
	'food',
	'drinks',
	'atm',
	'coat-check',
	'security',
	'first-aid',
	'photography',
	'live-streaming',
	'translations',
	'signing',
	'kids-area',
	'vip',
	'merch',
	'shuttle',
];

const COUNT = 1_000;
const STEP = 200;

type Insert = z.infer<typeof $insert.event>;

export async function generate() {
	let step = STEP;
	const db = await getDb();

	const [allAddresses, allUsers] = await Promise.all([
		db.query.addresses.findMany({ columns: { id: true } }),
		db.query.users.findMany({ columns: { id: true } }),
	]);

	const addressIds = allAddresses.map((r) => r.id);
	const userIds = allUsers.map((r) => r.id);

	if (addressIds.length === 0) {
		throw new Error('No addresses found. Generate addresses first.');
	}

	if (userIds.length === 0) {
		throw new Error('No users found. Generate users first.');
	}

	for (let i = 0; i < COUNT; i += step) {
		if (i + step > COUNT) {
			step = COUNT - i;
		}

		const batch: Insert[] = [];

		for (let j = 0; j < step; j++) {
			const startsAt = faker.date.between({
				from: new Date(),
				to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
			});
			const durationHours = faker.number.int({ min: 1, max: 72 });
			const endsAt = new Date(
				startsAt.getTime() + durationHours * 60 * 60 * 1000,
			);
			const categories = faker.helpers.arrayElements(eventCategories, {
				min: 1,
				max: 4,
			});
			const amenities = faker.helpers.arrayElements(eventAmenities, {
				min: 0,
				max: 8,
			});
			const isOnline = faker.datatype.boolean({ probability: 0.25 });

			batch.push({
				id: nanoid(),
				title: faker.lorem.sentence({ min: 3, max: 8 }).replace(/\.$/, ''),
				description: faker.lorem.paragraphs({ min: 1, max: 4 }),
				startsAt,
				endsAt,
				addressId: faker.helpers.arrayElement(addressIds),
				organizerId: faker.helpers.arrayElement(userIds),
				externalUrl: faker.datatype.boolean({ probability: 0.4 })
					? faker.internet.url()
					: null,
				ageRestriction: faker.helpers.arrayElement(ageRestrictions),
				amenities,
				refundPolicy: faker.helpers.arrayElement(refundPolicies),
				faq: {},
				placeId: null,
				isOnline,
				recurrence: faker.helpers.arrayElement(recurrences),
				categories,
			});
		}

		await db.insert(schema.events).values(batch);
	}
}
