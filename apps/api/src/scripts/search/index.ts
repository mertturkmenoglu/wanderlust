import { consola } from 'consola';
import { bootstrapServices, container } from '@/ioc';
import { SearchService } from '@/lib/search';
import { handlePlaces } from './handle-places';

async function main() {
	await bootstrapServices();

	const search = container.get(SearchService).get();

	const start = performance.now();

	consola.start('Syncing primary database with Typesense');

	await handlePlaces(search);

	const end = performance.now();

	consola.success('Finished syncing with Typesense');
	consola.info(`Total time: ${(end - start).toFixed(2)} ms`);

	process.exit(0);
}

await main();
