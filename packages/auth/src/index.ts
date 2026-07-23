import { redisStorage } from '@better-auth/redis-storage';
import type { CacheService, RedisService } from '@wanderlust/cache';
import type { ConfigService } from '@wanderlust/config';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, bearer, multiSession, openAPI } from 'better-auth/plugins';
import { additionalFields } from './additional-fields';
import { hookAfterCreateUser } from './hooks';
import { sendResetPassword } from './password-reset';
import { session } from './session';
import { generateUsernameFromEmail } from './username';

export function createAuth(deps: {
	db: DatabaseService;
	cfg: ConfigService;
	jobs: JobsService;
	cache: CacheService;
	redis: RedisService;
}) {
	return betterAuth({
		database: drizzleAdapter(deps.db, {
			provider: 'pg',
			schema: schema,
			usePlural: true,
		}),
		baseURL: deps.cfg.api.url,
		databaseHooks: {
			user: {
				create: {
					after: async (user) => {
						await hookAfterCreateUser(deps.db, deps.cache, {
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
		trustedOrigins: deps.cfg.api.cors.allowedOrigins,
		appName: 'Wanderlust',
		emailAndPassword: {
			enabled: true,
			sendResetPassword: async (data) => {
				await sendResetPassword(data, deps.jobs);
			},
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: 'select_account',
				mapProfileToUser: (profile) => {
					return {
						email: profile.email,
						image: profile.picture,
						name: profile.name,
						username: generateUsernameFromEmail(profile.email),
					};
				},
			},
			facebook: {
				clientId: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				prompt: 'select_account',
				scope: ['email', 'public_profile'],
				mapProfileToUser: (profile) => {
					return {
						email: profile.email ?? '',
						image: profile.picture.data.url,
						name: profile.name,
						username: generateUsernameFromEmail(profile.email ?? ''),
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
		secondaryStorage: redisStorage({
			client: deps.redis,
			keyPrefix: 'wl-auth:',
		}),
		session,
	});
}

export type AuthService = ReturnType<typeof createAuth>;

export * from './username';
