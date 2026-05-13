import { availableParallelism } from 'node:os';
import Piscina from 'piscina';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';

export async function generate() {
	const placeIds = await readFile(paths.places);
	const userIds = await readFile(paths.users);

	const chunks = chunkArray(placeIds, 250);

	const pool = new Piscina({
		filename: new URL('./reviews-process.ts', import.meta.url).href,
		minThreads: availableParallelism(),
	});

	const results = await Promise.allSettled(
		chunks.map((chunk) =>
			pool.run({ placeIds: chunk, userIds }, { name: 'processChunk' }),
		),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate reviews:', result.reason);
		}
	}
}
