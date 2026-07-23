import type { RedisService } from '@wanderlust/cache';
import type { ConfigService } from '@wanderlust/config';
import type { DatabaseService } from '@wanderlust/db';
import type { EmailService } from '@wanderlust/email';

export type Dependencies = {
	config: ConfigService;
	email: EmailService;
	redis: RedisService;
	db: DatabaseService;
};
