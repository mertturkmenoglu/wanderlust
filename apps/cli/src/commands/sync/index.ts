import { command } from '@drizzle-team/brocli';
import { DatabaseService } from '@wanderlust/db';
import { SearchService } from '@wanderlust/search';
import consola from 'consola';
import { bootstrapServices } from './bootstrap';
import { container } from './ioc';
import { PlacesSchema } from './schema/places';

export const sync = command({
	name: 'sync',
	desc: 'Syncs the primary database with Typesense',
	options: {},
	handler: async (_opts) => {
		await bootstrapServices();

		const search = container.get(SearchService).get();
		const db = container.get(DatabaseService).get();

		const placesSchema = new PlacesSchema('places', search, db);
		const citiesSchema = new PlacesSchema('cities', search, db);

		const start = performance.now();

		consola.start('Syncing primary database with Typesense');

		await placesSchema.sync();
		await citiesSchema.sync();

		const end = performance.now();

		consola.success('Finished syncing with Typesense');
		consola.info(`Total time: ${(end - start).toFixed(2)} ms`);

		process.exit(0);
	},
});
