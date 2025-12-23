import { Container, type IServiceProvider } from '../di';
import { initJobs as initEmailJobs } from './email';

export class JobsProvider implements IServiceProvider<TJobsService> {
	private readonly instance: TJobsService;

	constructor(ioc: Container) {
		this.instance = init(ioc);
	}

	get(): TJobsService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TJobsService>('jobs');
	}
}

function init(ioc: Container) {
	const email = initEmailJobs(ioc);

	return {
		email,
	};
}

export type TJobsService = ReturnType<typeof init>;
