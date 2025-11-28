import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, BookmarkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { cn } from '@/lib/utils';
import { useBookmarksContext } from './-context';

type Props = {
	bookmark: components['schemas']['GetUserBookmarksOutputBody']['bookmarks'][number];
};

export function Actions({ bookmark }: Props) {
	const invalidator = useInvalidator();
	const ctx = useBookmarksContext();

	const mutation = api.useMutation('delete', '/api/v2/bookmarks/{id}', {
		onSuccess: async () => {
			await invalidator.invalidate();
			ctx.setIndex(0);
			toast.success('Bookmark removed');
		},
	});

	return (
		<div className="my-4 flex items-center justify-between gap-4">
			<Button
				variant="outline"
				size="sm"
				onClick={() => {
					mutation.mutate({
						params: {
							path: {
								id: bookmark.placeId,
							},
						},
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
