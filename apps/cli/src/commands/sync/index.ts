import { command } from '@drizzle-team/brocli';
import { DatabaseService } from '@wanderlust/db';
import { SearchService } from '@wanderlust/search';
import consola from 'consola';
import { bootstrapServices } from './bootstrap';
import { container } from './ioc';
import { CitiesSchema } from './schema/cities';
import { PlacesSchema } from './schema/places';
import { UsersSchema } from './schema/users';

export const sync = command({
	name: 'sync',
	desc: 'Syncs the Typesense with the primary database',
	options: {},
	handler: async (_opts) => {
		await bootstrapServices();

		const search = container.get(SearchService).get();
		const db = container.get(DatabaseService).get();

		const placesSchema = new PlacesSchema('places', search, db);
		const citiesSchema = new CitiesSchema('cities', search, db);
		const usersSchema = new UsersSchema('users', search, db);

		const start = performance.now();

		consola.start('Syncing Typesense with the primary database');

		await placesSchema.sync();
		await citiesSchema.sync();
		await usersSchema.sync();

		const end = performance.now();

		consola.success('Finished syncing with Typesense');
		consola.info(`Total time: ${(end - start).toFixed(2)} ms`);

		process.exit(0);
	},
});
