import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { contract } from './contract';
import { ComposeService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>().use(requireAuth);
	const svc = container.get(ComposeService);

	return os.use(withErrorNormalization).router({
		unfurlLink: os.unfurlLink.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.unfurlLink(userId, input);

			return result;
		}),
		gifSearch: os.gifSearch.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.gifSearch(userId, input);

			return result;
		}),
		stickerList: os.stickerList.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await svc.stickerList(userId, input);

			return result;
		}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ComposeService).toSelf();
});
