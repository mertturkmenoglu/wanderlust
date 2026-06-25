import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import { ItemActions } from '@wanderlust/ui/components/item';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useCommentContext } from './context';
import { useDeleteCommentMutation } from './hooks';

export function Actions() {
	const ctx = useCommentContext();
	const mutation = useDeleteCommentMutation();

	const confirm = useConfirmDialog();

	if (!ctx.canSeeActions) {
		return null;
	}

	return (
		<ItemActions>
			{confirm.Dialog}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontalIcon />
						<span className="sr-only">Comment actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{ctx.canEdit && (
						<DropdownMenuItem
							variant="default"
							onClick={() => ctx.setIsEditMode(true)}
						>
							<PencilIcon />
							<span>Edit</span>
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						variant="destructive"
						onClick={async (e) => {
							e.preventDefault();

							const ok = await confirm.confirm({
								title: 'Are you sure you want to delete this comment?',
								variant: 'destructive',
								cancelText: 'Cancel',
								confirmText: 'Delete',
								description: 'This action is irreversible.',
							});

							if (!ok) {
								return;
							}

							mutation.mutate({
								id: ctx.comment.tripId,
								commentId: ctx.comment.id,
							});
						}}
					>
						<Trash2Icon className="size-4" />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</ItemActions>
	);
}
