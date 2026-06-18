import { CacheService, type TCacheService } from '@wanderlust/cache';
import { ConfigService, type TConfigService } from '@wanderlust/config';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, multiSession, openAPI } from 'better-auth/plugins';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthService {
	private readonly instance: TAuthService;

	constructor(
		@inject(DatabaseService) private readonly db: DatabaseService,
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(JobsService) private readonly jobs: JobsService,
		@inject(CacheService) private readonly cache: CacheService,
	) {
		this.instance = init(
			this.db.get(),
			this.cfg.get(),
			this.jobs.get(),
			this.cache.get(),
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
						const channels = schema.notificationChannelType.enumValues;
						const categories = schema.notificationCategoryType.enumValues;
						const preferences = channels.flatMap((ch) =>
							categories.map((c) => ({
								channel: ch,
								category: c,
								enabled: true,
								userId: user.id,
							})),
						);
						await db.insert(schema.notificationPreferences).values(preferences);
						await cache.namespace('activities').setForever({
							key: user.username as string,
							value: [],
						});
					},
				},
			},
		},
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
		],
		trustedOrigins: cfg.api.cors.allowedOrigins,
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
				mapProfileToUser: (profile: TFacebookUser): TUser => {
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
	email?: string | undefined;
	picture: {
		data: {
			url: string;
		};
	};
	name: string;
};

export type TAuthService = ReturnType<typeof init>;
