import { RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email';
import { inject, injectable } from 'inversify';
import type { Dependencies } from './internal/types';
import { defineEmailJobs } from './jobs/emails';
import { defineNotificationsJobs } from './jobs/notifications';

@injectable()
export class JobsService {
	private readonly instance: TJobsService;

	constructor(
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(EmailService) private readonly email: EmailService,
		@inject(RedisService) private readonly redis: RedisService,
		@inject(DatabaseService) private readonly db: DatabaseService,
	) {
		this.instance = init({
			config: this.cfg.get(),
			email: this.email.get(),
			redis: this.redis.get(),
			db: this.db.get(),
		});
	}

	get(): TJobsService {
		return this.instance;
	}
}

function init(deps: Dependencies) {
	return {
		emails: defineEmailJobs(deps),
		notifications: defineNotificationsJobs(deps),
	};
}

export type TJobsService = ReturnType<typeof init>;
