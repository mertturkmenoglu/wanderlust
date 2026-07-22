import { $ } from 'bun';
import { defineGenerator } from '@/lib/define-generator';

const resources = [
	'accolades',
	'assets',
	'places',
	'users',
	'reviews',
	'collections',
	'lists',
];

export const fakeIdGenerator = defineGenerator({
	generate: async () => {
		await $`mkdir -p tmp`;

		for (const resource of resources) {
			// Select the IDs from a table, output them to a CSV file.
			await $`docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM ${resource}" --csv -o /home/${resource}.csv`;

			// Copy the CSV file from the Docker container to the local tmp directory.
			await $`docker cp wl-postgres:/home/${resource}.csv tmp/${resource}.csv`;

			// Remove the header line from the CSV file and save the result to a text file.
			await $`tail -n +2 tmp/${resource}.csv > tmp/${resource}.txt`;

			// Remove the CSV file from the tmp directory.
			await $`rm tmp/${resource}.csv`;
		}
	},
});
