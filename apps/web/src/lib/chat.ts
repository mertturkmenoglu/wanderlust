import type { ChatAppType } from '@wanderlust/chat';
import { hc } from 'hono/client';

export const chatClient = hc<ChatAppType>('http://localhost:5005', {
	init: {
		credentials: 'include',
	},
});
