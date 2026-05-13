import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import type z from 'zod';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';
import { getDb } from './common';

const imageIds = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
	60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
	79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 98, 99,
	100, 101, 102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
	116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
	131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146,
	147, 149, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163,
	164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178,
	179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
	194, 195, 196, 197, 198, 199, 200,
];

function randomImageUrl(): string {
	return `https://picsum.photos/id/${faker.helpers.arrayElement(imageIds)}/960/720`;
}

type Insert = z.infer<typeof $insert.asset>;

export async function generate() {
	const eventIds = await readFile(paths.events);
	const chunks = chunkArray(eventIds, 200);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate event assets', {
				cause: result.reason,
			});
		}
	}
}

async function processChunk(eventIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const eventId of eventIds) {
		const count = faker.number.int({ min: 2, max: 8 });

		for (let i = 0; i < count; i++) {
			batch.push({
				entityType: 'event',
				entityId: eventId,
				url: randomImageUrl(),
				description: null,
				order: i + 1,
			});
		}
	}

	await db.insert(schema.assets).values(batch);
}
