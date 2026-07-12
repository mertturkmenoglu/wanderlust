import { Agent } from './agent';
import { L } from './logger';
import { waitUntilApiIsHealthy } from './utils';
import { usernames } from './well-known';

const l = L.scope('main');

async function main() {
	l.info('Wanderlust Agent Based Simulation Program');

	await waitUntilApiIsHealthy();

	await startAgents();
}

async function startAgents() {
	const agents = await Promise.all(usernames.map((u) => Agent.load(u)));

	await Promise.all(agents.map((a) => Agent.save(a)));
}

main();
