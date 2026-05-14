import { ConfigService, type TConfigService } from '@wanderlust/config';
import { EmailService, type TEmailService } from '@wanderlust/email';
import { inject, injectable } from 'inversify';
import { initJobs } from './email';

@injectable()
export class JobsService {
	private readonly instance: TJobsService;

	constructor(
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(EmailService) private readonly email: EmailService,
	) {
		this.instance = init(this.cfg.get(), this.email.get());
	}

	get(): TJobsService {
		return this.instance;
	}
}

function init(cfg: TConfigService, email: TEmailService) {
	const emailJobs = initJobs(cfg, email);

	return {
		email: emailJobs,
	};
}

export type TJobsService = ReturnType<typeof init>;
