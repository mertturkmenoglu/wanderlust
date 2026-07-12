import type signale from 'signale';
import { Actions } from './actions';
import { Auth } from './auth';
import { L } from './logger';
import { CustomStorage } from './persistence';
import { $, CHARS } from './utils';

const actions = new Actions();

const availableActions = [
	actions.getMe,
	actions.accolades_list,
	actions.accolades_get,
	actions.accolades_getPlaces,
	actions.aggregator_home,
	actions.amenities_list,
	actions.bookmarks_list,
	actions.bookmarks_create,
	actions.bookmarks_delete,
	actions.categories_get,
	actions.categories_list,
	actions.cities_list,
	actions.cities_get,
	actions.cities_listFeatured,
	actions.collections_get,
	actions.collections_list,
	actions.collections_placesList,
	actions.collections_citiesList,
	actions.favorites_list,
	actions.favorites_create,
	actions.favorites_delete,
	actions.favorites_listByUsername,
];

export class Agent {
	private readonly username: string;
	private readonly user: Auth.User;
	private readonly token: string;
	private readonly logger: signale.Signale<signale.DefaultMethods>;
	private static readonly persister = CustomStorage;
	private timer: ReturnType<typeof setTimeout> | null = null;
	private lastRun: number | null = null;
	private runInterval: number;

	constructor(username: string, user: Auth.User, token: string) {
		this.username = username;
		this.user = user;
		this.token = token;
		this.logger = L.scope(`agent:${this.username}`.padEnd(15, CHARS.BLANK));

		this.runInterval = $.Random.int(3000, 20_000);
		this.logger.info(`Run interval set to ${this.runInterval} ms`);
		this.schedule();
	}

	private schedule() {
		this.logger.info('Scheduling next run');
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}

		const elapsed =
			this.lastRun === null ? this.runInterval : Date.now() - this.lastRun;
		const delay = Math.max(0, this.runInterval - elapsed);

		this.timer = setTimeout(() => {
			this.timer = null;
			void this.runTick();
		}, delay);
	}

	private async runTick() {
		this.lastRun = Date.now();

		try {
			await this.runAction();
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error('Scheduled run failed', err.message);
			} else {
				this.logger.error('Scheduled run failed', String(err));
			}
		} finally {
			this.runInterval = $.Random.int(3000, 20_000);
			this.logger.info(`Next run interval set to ${this.runInterval} ms`);
			this.schedule();
		}
	}

	private async runAction() {
		const action = $.Random.element(availableActions);

		await action(this);
	}

	getUsername(): string {
		return this.username;
	}

	getUser(): Auth.User {
		return this.user;
	}

	getToken(): string {
		return this.token;
	}

	getLogger(): signale.Signale<signale.DefaultMethods> {
		return this.logger;
	}

	static async load(username: string): Promise<Agent> {
		const res = await Agent.persister.getItem(`agent-${username}`);

		if (res === null) {
			const authRes = await Auth.signIn(username);

			if (!authRes) {
				throw new Error(`Failed to sign in user ${username}`);
			}

			return new Agent(username, authRes.user, authRes.token);
		}

		return new Agent(res.username, res.user, res.token);
	}

	static async save(agent: Agent): Promise<void> {
		await Agent.persister.setItem(`agent-${agent.getUsername()}`, {
			username: agent.username,
			user: agent.user,
			token: agent.token,
			lastRun: agent.lastRun,
		});
	}
}
