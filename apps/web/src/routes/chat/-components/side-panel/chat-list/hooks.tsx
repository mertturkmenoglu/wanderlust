import { useSuspenseQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';

export function useChatListQuery() {
	return useSuspenseQuery(
		orpc.chats.chats.list.queryOptions({
			input: {},
		}),
	);
}
