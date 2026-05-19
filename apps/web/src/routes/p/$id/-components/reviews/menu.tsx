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
import { EllipsisVerticalIcon, FlagIcon, TrashIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import type { Outputs } from '@/lib/orpc';
import { useDeleteReviewMutation } from './hooks';

type Props = {
	review: Outputs['reviews']['listByPlaceId']['reviews'][number];
};

export function Menu({ review }: Props) {
	const session = authClient.useSession();
	const isOwner = session.data?.user.id === review.userId;
	const mutation = useDeleteReviewMutation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<EllipsisVerticalIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
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
