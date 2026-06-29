import { implement } from '@orpc/server';
import { chats } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { AuthContext } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { requireAuth } from '@/middlewares/authn';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { ChatRepository } from './repository';
import { ChatService } from './service';

export const module = defineModule({
	exports: [ChatService, ChatRepository],
	router: () => {
		const os = implement(chats.chats.contract)
			.$context<AuthContext>()
			.use(requireAuth)
			.use(withErrorNormalization);

		const svc = container.get(ChatService);

		return os.router({
			create: os.create.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.create(userId, input);

				return result;
			}),
			open: os.open.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.open(userId, input);

				return result;
			}),
			hasDirectChat: os.hasDirectChat.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.hasDirectChat(userId, input);

				return result;
			}),
			info: os.info.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.info(userId, input);

				return result;
			}),
			list: os.list.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.list(userId, input);

				return result;
			}),
			update: os.update.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.update(userId, input);

				return result;
			}),
			leave: os.leave.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.leave(userId, input);

				return result;
			}),
			clear: os.clear.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.clear(userId, input);

				return result;
			}),
			markRead: os.markRead.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.markRead(userId, input);

				return result;
			}),
			pin: os.pin.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.pin(userId, input);

				return result;
			}),
			unpin: os.unpin.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.unpin(userId, input);

				return result;
			}),
			unread: os.unread.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.unread(userId, input);

				return result;
			}),
			mute: os.mute.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.mute(userId, input);

				return result;
			}),
			unmute: os.unmute.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.unmute(userId, input);

				return result;
			}),
			delete: os.delete.handler(async ({ input, context }) => {
				const userId = context.session.user.id;
				const result = await svc.delete(userId, input);

				return result;
			}),
		});
	},
});
