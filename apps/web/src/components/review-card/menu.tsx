import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	EllipsisVerticalIcon,
	FlagIcon,
	SendIcon,
	Share2Icon,
	TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth';
import type { Outputs } from '@/lib/orpc';
import { useDeleteReviewMutation } from './hooks';

type Props = {
	review: Outputs['reviews']['listByPlaceId']['reviews'][number];
};

export function Menu({ review }: Props) {
	const session = authClient.useSession();
	const isOwner = session.data?.user.id === review.userId;
	const mutation = useDeleteReviewMutation(review.placeId);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<EllipsisVerticalIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuItem>
					<Link to="/chat" className="flex w-full items-center justify-between">
						Send via Chat
						<DropdownMenuShortcut>
							<SendIcon className="size-3" />
						</DropdownMenuShortcut>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Button
						className="flex w-full cursor-pointer items-center justify-between"
						variant="ghost"
						onClick={async () => {
							await window.navigator.clipboard.writeText(
								`${window.location.origin}/p/${review.placeId}/reviews/${review.id}`,
							);
							toast.success('Link copied to clipboard');
						}}
					>
						Share
						<DropdownMenuShortcut>
							<Share2Icon className="size-3" />
						</DropdownMenuShortcut>
					</Button>
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Link
						to="/report"
						search={{
							id: review.id,
							type: 'review',
						}}
						className="flex w-full items-center justify-between"
					>
						Report
						<DropdownMenuShortcut>
							<FlagIcon className="size-3" />
						</DropdownMenuShortcut>
					</Link>
				</DropdownMenuItem>

				{isOwner && (
					<>
						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() => {
								if (confirm('Are you sure you want to delete this review?')) {
									mutation.mutate({
										id: review.id,
									});
								}
							}}
						>
							Delete
							<DropdownMenuShortcut>
								<TrashIcon className="size-3" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
