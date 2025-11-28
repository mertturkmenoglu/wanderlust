import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { PlacesRepository } from './repository';
import { PlacesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const db = ioc.resolve(DbProvider.id);
	const repo = new PlacesRepository(db);
	const service = new PlacesService(repo);

	return os.router({
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session?.user?.id || null;
			const result = await service.get(input, userId);

			return result;
		}),
		peek: os.peek.handler(async () => {
			const result = await service.peek();

			return result;
		}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.update(input);

				return result;
			}),
		updateAddress: os.updateAddress
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.updateAddress(input);

				return result;
			}),
		updateAmenities: os.updateAmenities
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.updateAmenities(input);

				return result;
			}),
		updateHours: os.updateHours
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await service.updateHours(input);

				return result;
			}),
	});
}
