import type { RouterClient } from '@orpc/server';
import * as chat from './chat';

export type AppRouter = {
	chat: ReturnType<typeof chat.getRouter>;
}

export function getAppRouter(): AppRouter {
	return {
		chat: chat.getRouter(),
	}
}

export const modules = [
	chat.module,
];

export type ChatRouter = RouterClient<AppRouter>;
