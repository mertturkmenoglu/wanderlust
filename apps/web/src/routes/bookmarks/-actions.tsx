import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { ArrowRightIcon, BookmarkIcon } from 'lucide-react';
import { type TBookmark, useDeleteBookmarkMutation } from './-hooks';

type Props = {
	bookmark: TBookmark;
};

export function Actions({ bookmark }: Props) {
	const mutation = useDeleteBookmarkMutation();

	const onClick = () => {
		mutation.mutate({
			placeId: bookmark.placeId,
		});
	};

	return (
		<div className="my-4 flex items-center justify-between gap-4">
			<Button
				variant="outline"
				size="sm"
				onClick={onClick}
				disabled={mutation.isPending}
			>
				{mutation.isPending ? (
					<Spinner />
				) : (
					<BookmarkIcon className="fill-primary text-primary" />
				)}
				Remove
			</Button>

			<Link
				to="/p/$id"
				params={{ id: bookmark.placeId }}
				className={buttonVariants({
					variant: 'default',
					size: 'sm',
					className: 'flex-1',
				})}
			>
				<span>See Details</span>
				<ArrowRightIcon />
			</Link>
		</div>
	);
}
