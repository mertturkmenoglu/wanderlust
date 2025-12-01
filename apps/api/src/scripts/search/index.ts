import { bootstrapServices, ioc } from '@/ioc';
import { SearchProvider } from '@/lib/search';
import { handlePlaces } from './handle-places';

async function main() {
	await bootstrapServices();

	const search = ioc.resolve(SearchProvider.id);

	const start = performance.now();

	console.log('Syncing places with the search index...');

	await handlePlaces(search);

	const end = performance.now();
	console.log('Finished syncing places with the search index.');
	console.log(`Time taken: ${(end - start).toFixed(2)} ms`);
}

await main();
