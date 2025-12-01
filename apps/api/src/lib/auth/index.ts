import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DbProvider, type TDatabaseService } from '@/db';
import * as schema from '../../db/schema';
import { ConfigProvider, type TConfig } from '../config';
import { Container, type IServiceProvider } from '../di';
import { JobsProvider, type TJobsService } from '../jobs';

export class AuthProvider implements IServiceProvider<TAuthService> {
	private readonly instance: TAuthService;

	constructor(ioc: Container) {
		const db = ioc.resolve(DbProvider.id);
		const cfg = ioc.resolve(ConfigProvider.id);
		const jobs = ioc.resolve(JobsProvider.id);
		this.instance = init(db, jobs, cfg);
	}

	get(): TAuthService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TAuthService>('auth');
	}
}

function init(db: TDatabaseService, jobs: TJobsService, cfg: TConfig) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema: schema,
			usePlural: true,
		}),
		user: {
			// TODO: Investigate why defining these columns in the Drizzle table doesn't automatically
			// add them to the user object and if there's a way to do it, we should do it.
			//
			// TODO: Adding required: false makes the field string | null | undefined, which is not ideal.
			// We want string | null.
			additionalFields: {
				username: {
					type: 'string',
					input: true,
				},
				banner: {
					type: 'string',
					input: false,
					required: false,
				},
				bio: {
					type: 'string',
					input: true,
					required: false,
				},
				website: {
					type: 'string',
					input: true,
					required: false,
				},
				followersCount: {
					type: 'number',
					input: false,
					required: false,
				},
				followingCount: {
					type: 'number',
					input: false,
					required: false,
				},
			},
		},
		trustedOrigins: cfg.cors.allowedOrigins,
		appName: 'Wanderlust',
		emailAndPassword: {
			enabled: true,
			sendResetPassword: async ({ url, user }) => {
				await jobs.email.queue.add('emails/password-reset', {
					email: user.email,
					url,
				});
			},
		},
		advanced: {
			defaultCookieAttributes: {
				sameSite: 'Lax',
				secure: true,
				httpOnly: true,
			},
		},
	});
}

export type TAuthService = ReturnType<typeof init>;
