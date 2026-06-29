import { implement } from '@orpc/server';
import { chats } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { ComposeService } from './service';

export const module = defineModule({
	exports: [ComposeService],
	router: () => {
		const os = implement(chats.compose.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization);

		const svc = container.get(ComposeService);

		return os.router({
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
	},
});
