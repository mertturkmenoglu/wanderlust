import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, BookmarkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { useBookmarksContext } from './-context';
import type { TBookmark } from './-types';

type Props = {
	bookmark: TBookmark;
};

export function Actions({ bookmark }: Props) {
	const invalidate = useInvalidator();
	const ctx = useBookmarksContext();

	const mutation = useMutation(
		orpc.bookmarks.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				ctx.setIndex(0);
				toast.success('Bookmark removed');
			},
		}),
	);

	return (
		<div className="my-4 flex items-center justify-between gap-4">
			<Button
				variant="outline"
				size="sm"
				onClick={() => {
					mutation.mutate({
						placeId: bookmark.placeId,
					});
				}}
			>
				<BookmarkIcon className="fill-primary text-primary" />
				Remove Bookmark
			</Button>

			<Link
				to="/p/$id"
				params={{ id: bookmark.placeId }}
				className={cn(
					'flex-1',
					buttonVariants({ variant: 'default', size: 'sm' }),
				)}
			>
				<span>See Details</span>
				<ArrowRightIcon />
			</Link>
		</div>
	);
}
