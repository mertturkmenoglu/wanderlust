import { useSuspenseQuery } from '@tanstack/react-query';
import { chatRpc } from '@/lib/chat';

export function useChatListQuery() {
	return useSuspenseQuery(
		chatRpc.chat.list.queryOptions({
			input: {},
		}),
	);
}
