import { createAgentStore as createAgentStoreV2 } from './agent';
import { L } from './logger';
import { waitUntilApiIsHealthy } from './utils';
import { usernames } from './well-known';

const l = L.scope('main');

async function main() {
	l.info('Wanderlust Agent Based Simulation Program');

	await waitUntilApiIsHealthy();

	fireAgents();
}

function fireAgents() {
	const agents = usernames.map((u) => createAgentStoreV2(u));

	agents.forEach((agent) => {
		agent.subscribe((state) => {
			if (state.state === 'destroyed') {
				l.info('Agent store v2 completed');
			}

			if (state.state === 'idle') {
				// TODO: Choose an action for the agent and start the loop here.
			}
		});

		// Start an agent only after it has been hydrated from the persisted state.
		// Otherwise it will always fire a sign in request.
		agent.persist.onFinishHydration(() => {
			agent.getState().init();
		});
	});
}

main();
