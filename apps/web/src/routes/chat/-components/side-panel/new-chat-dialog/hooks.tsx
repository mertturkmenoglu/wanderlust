import { skipToken, useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { useNewChatDialogContext } from './context';

export function useSearchFollowingQuery() {
	const ctx = useNewChatDialogContext();

	return useQuery(
		orpc.users.searchFollowing.queryOptions({
			input: ctx.isSearchQueryEnabled
				? { username: ctx.searchTerm }
				: skipToken,
		}),
	);
}
