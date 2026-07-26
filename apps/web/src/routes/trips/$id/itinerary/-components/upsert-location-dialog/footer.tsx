import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogFooter,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { Trash2Icon } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useUpsertLocationDialogContext } from './context';
import {
	useCreateLocationMutation,
	useDeleteLocationMutation,
	useUpdateLocationMutation,
} from './hooks';

type Props = {
	className?: string;
};

export function Footer({ className }: Props) {
	const ctx = useUpsertLocationDialogContext();

	const confirm = useConfirmDialog();

	const create = useCreateLocationMutation();
	const _delete = useDeleteLocationMutation();
	const update = useUpdateLocationMutation();

	const onDelete = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();

		const ok = await confirm.confirm({
			variant: 'destructive',
			title: 'Delete Location',
			description: 'Are you sure you want to delete this location?',
			confirmText: 'Delete',
		});

		if (!ok) {
			return;
		}

		if (!ctx.locId) {
			return;
		}

		_delete.mutate({
			id: ctx.tripId,
			locationId: ctx.locId,
		});

		console.log(e);
	};

	const onCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		if (ctx.update && ctx.locId !== undefined) {
			update.mutate({
				id: ctx.tripId,
				locationId: ctx.locId,
				scheduledTime: ctx.scheduledTime,
				description: ctx.description,
			});
		} else {
			create.mutate({
				id: ctx.tripId,
				placeId: ctx.placeId ?? '',
				scheduledTime: ctx.scheduledTime,
				description: ctx.description,
			});
		}
	};

	const isBtnDisabled =
		ctx.placeId === undefined || create.isPending || update.isPending;

	return (
		<AlertDialogFooter className={cn(className)}>
			{confirm.Dialog}

			{ctx.update && (
				<Button variant="destructive" onClick={onDelete}>
					<Trash2Icon />
					<span>Delete</span>
				</Button>
			)}

			<AlertDialogCancel className="ml-auto">Cancel</AlertDialogCancel>
			<AlertDialogAction disabled={isBtnDisabled} onClick={onCreate}>
				{ctx.update ? 'Update' : 'Add'}
			</AlertDialogAction>
		</AlertDialogFooter>
	);
}
