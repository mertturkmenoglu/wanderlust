import { createORPCClient, type InferClientInputs, type InferClientOutputs } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { ChatRouter } from '@wanderlust/chat';

export const chatLink = new RPCLink({
	url: 'http://localhost:5005/rpc',
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: 'include',
		});
	},
});

export const chatClient: ChatRouter = createORPCClient(chatLink);

export const chatRpc = createTanstackQueryUtils(chatClient);

export type ChatInputs = InferClientInputs<typeof chatClient>;

export type ChatOutputs = InferClientOutputs<typeof chatClient>;

export type TChat = ChatOutputs['chat']['info']['chat'];
