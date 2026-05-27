import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import type { Outputs } from '@/lib/orpc';
import { orpc } from '@/lib/orpc';
import { useBookmarksContext } from './-context';

export type TBookmark = Outputs['bookmarks']['list']['bookmarks'][number];

export function useBookmarksQuery() {
	const { page, pageSize } = useSearch({
		from: '/bookmarks/',
	});

	return useSuspenseQuery(
		orpc.bookmarks.list.queryOptions({
			input: {
				page,
				pageSize,
			},
			retry: false,
		}),
	);
}

export function useDeleteBookmarkMutation() {
	const ctx = useBookmarksContext();
	const invalidate = useInvalidator();

	return useMutation(
		orpc.bookmarks.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				ctx.setIndex(0);
				toast.success('Bookmark removed');
			},
		}),
	);
}

export const bookmarksSearchSchema = z.object({
	page: z.number().min(1).max(100).default(1).catch(1),
	pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});
