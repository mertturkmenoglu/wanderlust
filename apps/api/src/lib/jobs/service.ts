import { injectable } from 'inversify';
import { container } from '@/ioc';
import { initJobs as initEmailJobs } from './email';

@injectable()
export class JobsService {
	private readonly instance: TJobsService;

	constructor() {
		this.instance = init();
	}

	get(): TJobsService {
		return this.instance;
	}
}

function init() {
	const email = initEmailJobs(container);

	return {
		email,
	};
}

export type TJobsService = ReturnType<typeof init>;
