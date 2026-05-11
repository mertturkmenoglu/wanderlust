import { $ } from "bun";

async function main() {
	const domains = [
		'places',
		'users',
		'reviews',
		'collections',
		'lists',
		'events',
	];

	for (const domain of domains) {
		await $`docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM ${domain}" --csv -o /home/${domain}.csv`;

		await $`docker cp wl-postgres:/home/${domain}.csv tmp/${domain}.csv`;

		await $`tail -n +2 tmp/${domain}.csv > tmp/${domain}.txt`;

		await $`rm tmp/${domain}.csv`;
	}

}

await main();
