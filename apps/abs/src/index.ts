import { Auth } from './auth';
import { L } from './logger';
import { Persistence } from './persistence';
import { waitUntilApiIsHealthy } from './utils';

const l = L.scope('main');

async function main() {
	l.info('Wanderlust Agent Based Simulation Program');

	const [tokens, users] = await Persistence.load();

	Auth.setAuthState(tokens, users);

	await waitUntilApiIsHealthy();
}

main();
