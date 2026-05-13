import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { inject, injectable } from 'inversify';
import { DatabaseService, type TDatabaseService } from '@/lib/db';
import { ConfigService, type TConfigService } from '../config';
import { JobsService, type TJobsService } from '../jobs';

@injectable()
export class AuthService {
	private readonly instance: TAuthService;

	constructor(
		@inject(DatabaseService) private readonly db: DatabaseService,
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(JobsService) private readonly jobs: JobsService,
	) {
		this.instance = init(this.db.get(), this.cfg.get(), this.jobs.get());
	}

	get(): TAuthService {
		return this.instance;
	}
}

function init(db: TDatabaseService, cfg: TConfigService, jobs: TJobsService) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema: schema,
			usePlural: true,
		}),
		baseURL: cfg.api.url,
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
				await jobs.email.queue.add('password-reset', {
					firstName: user.name,
					email: user.email,
					url,
				});
			},
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: 'select_account',
				mapProfileToUser: (profile: TGoogleUser): TUser => {
					return {
						email: profile.email,
						image: profile.picture,
						name: profile.name,
						username: profile.email.split('@')[0] ?? nanoid(10),
					};
				},
			},
			facebook: {
				clientId: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				prompt: 'select_account',
				scope: ['email', 'public_profile'],
				mapProfileToUser: (profile): TUser => {
					return {
						email: profile.email ?? '',
						image: profile.picture.data.url,
						name: profile.name,
						username: profile.email?.split('@')[0] ?? nanoid(10),
					};
				},
			},
		},
		advanced: {
			defaultCookieAttributes: {
				sameSite: 'Lax',
				secure: true,
				httpOnly: true,
			},
		},
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60,
				strategy: 'compact',
			},
		},
	});
}

export type TUser = {
	email: string;
	image: string;
	name: string;
	username: string;
};

export type TGoogleUser = {
	email: string;
	picture: string;
	name: string;
};

export type TFacebookUser = {
	email: string;
	picture: {
		data: {
			url: string;
		};
	};
	name: string;
};

export type TAuthService = ReturnType<typeof init>;
