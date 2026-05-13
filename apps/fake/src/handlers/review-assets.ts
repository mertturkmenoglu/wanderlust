import Piscina from 'piscina';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';

export async function generate() {
	const reviewIds = await readFile(paths.reviews);
	const chunks = chunkArray(reviewIds, 1000);

	const pool = new Piscina({
		filename: new URL('./review-assets-process.ts', import.meta.url).href,
		minThreads: 5,
		maxThreads: 10,
	});

	const results = await Promise.allSettled(
		chunks.map((chunk) => pool.run({ reviewIds: chunk }, { name: 'processChunk' })),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('Failed to generate review assets', result.reason);
		}
	}
}
