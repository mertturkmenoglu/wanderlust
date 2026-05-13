import { faker } from '@faker-js/faker';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { DatabaseService } from '@/lib/db';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { nanoid } from '@/lib/uid';
import { paths } from '..';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const ticketNames = [
	'General Admission',
	'VIP',
	'Early Bird',
	'Student',
	'Group',
	'Premium',
	'Backstage Pass',
	'Day Pass',
	'Weekend Pass',
	'Online Access',
];

type Insert = z.infer<typeof $insert.eventTicketOption>;

export async function generate() {
	const eventIds = await readFile(paths.events);
	const chunks = chunkArray(eventIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate event ticket options', {
				cause: result.reason,
			});
		}
	}
}

async function processChunk(eventIds: string[]) {
	const db = container.get(DatabaseService).get();
	const batch: Insert[] = [];

	for (const eventId of eventIds) {
		const hasTickets = faker.datatype.boolean({ probability: 0.7 });
		if (!hasTickets) continue;

		const count = faker.number.int({ min: 1, max: 3 });
		const currency = faker.helpers.arrayElement(currencies);
		const usedNames = new Set<string>();

		for (let i = 0; i < count; i++) {
			const availableNames = ticketNames.filter((n) => !usedNames.has(n));
			const name = faker.helpers.arrayElement(availableNames);
			usedNames.add(name);

			const total = faker.number.int({ min: 50, max: 5_000 });
			const sold = faker.number.int({ min: 0, max: total });

			batch.push({
				id: nanoid(),
				eventId,
				name,
				description: faker.lorem.sentence(),
				fee: faker.number.int({ min: 0, max: 50_000 }),
				currency,
				totalAvailability: total,
				currentAvailability: total - sold,
				externalUrl: faker.datatype.boolean({ probability: 0.3 })
					? faker.internet.url()
					: null,
			});
		}
	}

	if (batch.length > 0) {
		await db.insert(schema.eventTicketOptions).values(batch);
	}
}
