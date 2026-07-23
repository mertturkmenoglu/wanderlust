import type { TRedisService } from '@wanderlust/cache';
import type { TConfigService } from '@wanderlust/config';
import type { TDatabaseService } from '@wanderlust/db';
import type { TEmailService } from '@wanderlust/email';

export type Dependencies = {
	config: TConfigService;
	email: TEmailService;
	redis: TRedisService;
	db: TDatabaseService;
};
