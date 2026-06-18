import { DatabaseService } from '@wanderlust/db';
import { consola } from 'consola';
import { bootstrapServices, container } from '@/ioc';
import { SearchService } from '@/lib/search';
import { CitiesSchema } from './schemas/cities';
import { PlacesSchema } from './schemas/places';

async function main() {
	await bootstrapServices();

	const search = container.get(SearchService).get();
	const db = container.get(DatabaseService).get();

	const placesSchema = new PlacesSchema('places', search, db);
	const citiesSchema = new CitiesSchema('cities', search, db);

	const start = performance.now();

	consola.start('Syncing primary database with Typesense');

	await placesSchema.sync();
	await citiesSchema.sync();

	const end = performance.now();

	consola.success('Finished syncing with Typesense');
	consola.info(`Total time: ${(end - start).toFixed(2)} ms`);

	process.exit(0);
}

await main();
