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
	194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 206, 208, 209, 210,
	211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 225, 227,
	228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242,
	243, 244, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
	260, 261, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275,
	276, 277, 278, 279, 280, 281, 282, 283, 284, 287, 288, 289, 290, 291, 292,
	293, 294, 295, 296, 297, 299, 300, 301, 302, 304, 305, 306, 307, 308, 309,
	310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324,
	325, 326, 327, 328, 329, 330, 331, 334, 335, 336, 337, 338, 339, 340, 341,
	342, 343, 344, 345, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357,
	358, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373,
	374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388,
	389, 390, 391, 392, 393, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404,
	405, 406, 407, 408, 409, 410, 411, 412, 413, 415, 416, 417, 418, 419, 420,
	421, 423,
];

function getRandomImageUrl(): string {
	return `https://picsum.photos/id/${faker.helpers.arrayElement(imageIds)}/960/720`;
}

type Insert = z.infer<typeof $insert.asset>;

export async function generate() {
	const placeIds = await readFile(paths.places);

	const chunks = chunkArray(placeIds, 500);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate assets', result.reason);
		}
	}
}

async function processChunk(placeIds: string[]) {
	const batch: Insert[] = [];

	for (const placeId of placeIds) {
		const imageCount = faker.number.int({ min: 4, max: 10 });

		for (let i = 0; i < imageCount; i++) {
			batch.push({
				entityType: 'place',
				entityId: placeId,
				url: getRandomImageUrl(),
				description: `Photo of place ${placeId} - ${i + 1}`,
				order: i + 1,
			});
		}
	}

	const db = await getDb();

	await db.insert(schema.assets).values(batch);
}
