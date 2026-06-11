import { RedisService, type TRedisService } from '@wanderlust/cache';
import { ConfigService, type TConfigService } from '@wanderlust/config';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { EmailService, type TEmailService } from '@wanderlust/email';
import { inject, injectable } from 'inversify';
import { initEmailJobs } from './email';
import { initNotificationJobs } from './notification';

@injectable()
export class JobsService {
	private readonly instance: TJobsService;

	constructor(
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(EmailService) private readonly email: EmailService,
		@inject(RedisService) private readonly redis: RedisService,
		@inject(DatabaseService) private readonly db: DatabaseService,
	) {
		this.instance = init(
			this.cfg.get(),
			this.email.get(),
			this.redis.get(),
			this.db.get(),
		);
	}

	get(): TJobsService {
		return this.instance;
	}
}

function init(
	cfg: TConfigService,
	email: TEmailService,
	redis: TRedisService,
	db: TDatabaseService,
) {
	const emailJobs = initEmailJobs(cfg, email);
	const notificationJobs = initNotificationJobs(redis, db);

	return {
		email: emailJobs,
		notification: notificationJobs,
	};
}

export type TJobsService = ReturnType<typeof init>;
