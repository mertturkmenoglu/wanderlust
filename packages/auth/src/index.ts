import { redisStorage } from '@better-auth/redis-storage';
import {
	CacheService,
	RedisService,
	type TCacheService,
	type TRedisService,
} from '@wanderlust/cache';
import { ConfigService, type TConfigService } from '@wanderlust/config';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, bearer, multiSession, openAPI } from 'better-auth/plugins';
import { inject, injectable } from 'inversify';
import { additionalFields } from './additional-fields';
import { hookAfterCreateUser } from './hooks';
import { mapFacebookProfileToUser, mapGoogleProfileToUser } from './oauth';
import { sendResetPassword } from './password-reset';
import { session } from './session';

@injectable()
export class AuthService {
	private readonly instance: TAuthService;

	constructor(
		@inject(DatabaseService) private readonly db: DatabaseService,
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(JobsService) private readonly jobs: JobsService,
		@inject(CacheService) private readonly cache: CacheService,
		@inject(RedisService) private readonly redis: RedisService,
	) {
		this.instance = init(
			this.db.get(),
			this.cfg.get(),
			this.jobs.get(),
			this.cache.get(),
			this.redis.get(),
		);
	}

	get(): TAuthService {
		return this.instance;
	}
}

function init(
	db: TDatabaseService,
	cfg: TConfigService,
	jobs: TJobsService,
	cache: TCacheService,
	redis: TRedisService,
) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema: schema,
			usePlural: true,
		}),
		baseURL: cfg.api.url,
		databaseHooks: {
			user: {
				create: {
					after: async (user) => {
						await hookAfterCreateUser(db, cache, {
							id: user.id,
							username: user.username as string,
						});
					},
				},
			},
		},
		user: {
			additionalFields,
		},
		account: {
			accountLinking: {
				allowDifferentEmails: true,
			},
		},
		plugins: [
			admin(),
			multiSession({
				maximumSessions: 3,
			}),
			openAPI({
				path: '/',
			}),
			bearer(),
		],
		trustedOrigins: cfg.api.cors.allowedOrigins,
		appName: 'Wanderlust',
		emailAndPassword: {
			enabled: true,
			sendResetPassword: async (data) => {
				await sendResetPassword(data, jobs);
			},
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: 'select_account',
				mapProfileToUser: mapGoogleProfileToUser,
			},
			facebook: {
				clientId: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				prompt: 'select_account',
				scope: ['email', 'public_profile'],
				mapProfileToUser: mapFacebookProfileToUser,
			},
		},
		advanced: {
			defaultCookieAttributes: {
				sameSite: 'Lax',
				secure: true,
				httpOnly: true,
			},
		},
		secondaryStorage: redisStorage({
			client: redis,
			keyPrefix: 'wl-auth:',
		}),
		session,
	});
}

export type TAuthService = ReturnType<typeof init>;
