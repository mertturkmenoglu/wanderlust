import { faker } from '@faker-js/faker';

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

export function generateHours() {
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
