import { ItemGroup } from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { AppMessage } from '@/components/app-message';
import { Pagination } from '@/components/pagination';
import { Comment } from './comment';
import { useCommentListContext } from './context';
import { useCommentsQuery } from './hooks';
import type { CommentListProps } from './types';

export function Content({ className }: CommentListProps) {
	const ctx = useCommentListContext();

	const query = useCommentsQuery();
	const comments = query.data.comments;
	const pagination = query.data.pagination;

	if (comments.length === 0) {
		return <AppMessage empty="No comments yet" classNames={{ root: 'my-8' }} />;
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<ItemGroup className="gap-2">
				{comments.map((c) => (
					<Comment key={c.id} comment={c} />
				))}
			</ItemGroup>

			<Pagination
				className="mx-auto mt-4"
				pagination={pagination}
				onNextClick={() => ctx.setPage((prev) => prev + 1)}
				onPrevClick={() => ctx.setPage((prev) => prev - 1)}
			/>
		</div>
	);
}
