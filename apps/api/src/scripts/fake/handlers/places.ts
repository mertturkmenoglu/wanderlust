import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
import { nanoid } from '@/lib/uid';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const openings = ['07:00', '08:00', '09:00', '10:00', '11:00'];

const closings = ['17:00', '18:00', '19:00', '20:00', '21:00'];

function generateHours(): Record<string, string> {
	const hours: Record<string, string> = {};

	for (const day of days) {
		const o = faker.helpers.arrayElement(openings);
		const c = faker.helpers.arrayElement(closings);
		const str = `${o}-${c}`;
		hours[day] = str;
	}

	return hours;
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
	return faker.helpers.arrayElements(amenities, { min: 5, max: 25 });
}

const COUNT = 10_000;
const STEP = 500;

type Insert = z.infer<typeof $insert.place>;

export async function generate() {
	let step = STEP;
	const db = ioc.resolve(DbProvider.id);

	for (let i = 0; i < COUNT; i += step) {
		if (i + step > COUNT) {
			step = COUNT - i;
		}

		const queryResult = await db.query.addresses.findMany({
			orderBy: sql`RANDOM()`,
			limit: step,
			columns: {
				id: true,
			},
		});

		const addressIds = queryResult.map((r) => r.id);

		await db.transaction(async (tx) => {
			for (let j = 0; j < step; j++) {
				const hours = generateHours();
				const amenities = generateAmenities();

				const value: Insert = {
					id: nanoid(),
					name: faker.lorem.sentence({ min: 2, max: 6 }).replace('.', ''),
					description: faker.lorem.paragraphs(
						faker.number.int({ min: 1, max: 3 }),
					),
					addressId: faker.helpers.arrayElement(addressIds),
					phone: faker.phone.number(),
					accessibilityLevel: faker.number.int({ min: 1, max: 5 }),
					priceLevel: faker.number.int({ min: 1, max: 5 }),
					website: faker.internet.url(),
					hours: hours,
					amenities: amenities,
					categoryId: faker.number.int({ min: 1, max: 23 }),
					totalFavorites: 0,
					totalPoints: 0,
					totalVotes: 0,
				};

				await tx.insert(schema.places).values(value);
			}
		});
	}
}
