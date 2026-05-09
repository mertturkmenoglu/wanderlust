import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { contract } from './contract';
import { UsersService } from './service';

export function getRouter() {
	const os = implement(contract).$context<AuthContext>().use(requireAuth);
	const svc = container.get(UsersService);

	return os.router({
		updateImage: os.updateImage.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateImage(userId, input);

			return result;
		}),
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.get(userId, input);

			return result;
		}),
		getMe: os.getMe.handler(async ({ context }) => {
			const userId = context.session.user.id;
			const result = await svc.getMe(userId);

			return result;
		}),
		getRole: os.getRole.handler(async ({ context }) => {
			const userId = context.session.user.id;
			const result = await svc.getRole(userId);

			return result;
		}),
		listFollowers: os.listFollowers.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listFollowers(userId, input);

			return result;
		}),
		listFollowing: os.listFollowing.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listFollowing(userId, input);

			return result;
		}),
		listTopPlaces: os.listTopPlaces.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listTopPlaces(userId, input);

			return result;
		}),
		updateTopPlaces: os.updateTopPlaces.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.updateTopPlaces(userId, input);

			return result;
		}),
		listActivities: os.listActivities.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.listActivities(userId, input);

			return result;
		}),
		searchFollowing: os.searchFollowing.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.searchFollowing(userId, input);

			return result;
		}),
		follow: os.follow.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.follow(userId, input);

			return result;
		}),
		update: os.update.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.update(userId, input);

			return result;
		}),
	});
}
