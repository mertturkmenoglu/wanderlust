import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { contract } from './contract';
import { PlacesRepository } from './repository';
import { PlacesService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(PlacesService);

	return os.router({
		get: os.get.handler(async ({ input, context }) => {
			const userId = context.session?.user?.id || null;
			const result = await svc.get(input, userId);

			return result;
		}),
		peek: os.peek.handler(async () => {
			const result = await svc.peek();

			return result;
		}),
		update: os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.update(input);

				return result;
			}),
		updateAddress: os.updateAddress
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.updateAddress(input);

				return result;
			}),
		updateAmenities: os.updateAmenities
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.updateAmenities(input);

				return result;
			}),
		updateHours: os.updateHours
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input, context, errors }) => {
				if (!context.session?.user) {
					throw errors.UNAUTHORIZED();
				}

				const result = await svc.updateHours(input);

				return result;
			}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(PlacesService).toSelf();
	bind(PlacesRepository).toSelf();
});
