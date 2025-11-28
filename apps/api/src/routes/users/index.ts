import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import { CacheProvider } from '@/lib/cache';
import type { AuthContext } from '@/lib/context';
import { StorageProvider } from '@/lib/storage';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { UsersRepository } from './repository';
import { UsersService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const db = ioc.resolve(DbProvider.id);
	const cache = ioc.resolve(CacheProvider.id);
	const storage = ioc.resolve(StorageProvider.id);
	const repo = new UsersRepository(db, cache);
	const service = new UsersService(repo, storage);

	return os.router({
		updateImage: os.updateImage.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateImage(userId, input);

			return result;
		}),
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.get(userId, input);

			return result;
		}),
		listFollowers: os.listFollowers.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listFollowers(userId, input);

			return result;
		}),
		listFollowing: os.listFollowing.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listFollowing(userId, input);

			return result;
		}),
		listTopPlaces: os.listTopPlaces.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listTopPlaces(userId, input);

			return result;
		}),
		updateTopPlaces: os.updateTopPlaces.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.updateTopPlaces(userId, input);

			return result;
		}),
		listActivities: os.listActivities.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.listActivities(userId, input);

			return result;
		}),
		searchFollowing: os.searchFollowing.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.searchFollowing(userId, input);

			return result;
		}),
		follow: os.follow.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.follow(userId, input);

			return result;
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await service.update(userId, input);

			return result;
		}),
	});
}
