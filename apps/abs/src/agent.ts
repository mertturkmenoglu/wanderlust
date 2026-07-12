import { combine, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { Auth } from './auth';
import { L } from './logger';
import { CustomStorage } from './persistence';
import { CHARS } from './utils';

type State = 'init' | 'idle' | 'running' | 'error' | 'destroyed';

export function createAgentStore(username: string) {
	return createStore(
		persist(
			combine(
				{
					state: 'init' as State,
					username: username,
					user: {} as Auth.User,
					token: '',
					error: null as Error | null,
					logger: L.scope(`agent:${username}`.padEnd(15, CHARS.BLANK)),
				},
				(set, get) => {
					return {
						async init() {
							const { username, logger, state, token } = get();

							set({ state: 'init' });

							logger.info(`Agent is in ${state} state`);

							try {
								if (token === '') {
									const res = await Auth.signIn(username);

									if (!res) {
										throw new Error(`Failed to sign in user ${username}`);
									}

									set({
										user: res.user,
										token: res.token,
										state: 'idle',
									});

									logger.info('Agent is in idle state');
								} else {
									logger.info('Agent already has a token, skipping sign in');
									set({ state: 'idle' });
									logger.info('Agent is in idle state');
								}
							} catch (err) {
								logger.error('Failed to initialize agent', err);
								set({ state: 'error', error: err as Error });
							}
						},
						async destroy() {
							set({ state: 'destroyed' });
							get().logger.info('Agent is in destroyed state');
						},
					};
				},
			),
			{
				name: `agent-store-${username}`,
				version: 1,
				partialize: (state) => ({
					token: state.token,
					user: state.user,
					state: state.state,
					username: state.username,
				}),
				storage: CustomStorage,
			},
		),
	);
}

export type AgentStore = ReturnType<typeof createAgentStore>;
