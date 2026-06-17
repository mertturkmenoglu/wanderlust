import { Button } from '@wanderlust/ui/components/button';
import { toast } from 'sonner';
import { CreateListDialog } from '@/components/lists/create-list-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useAddToListContext } from './context';

export function CreateList() {
	const ctx = useAddToListContext();
	const invalidate = useInvalidator();

	return (
		<CreateListDialog
			open={ctx.newListDialogOpen}
			setOpen={ctx.setNewListDialogOpen}
			onSuccess={async () => {
				toast.success('List created');
				await invalidate();
				ctx.setNewListDialogOpen(false);
			}}
		>
			<Button
				variant="secondary"
				onClick={(e) => {
					e.preventDefault();
					ctx.setNewListDialogOpen(true);
				}}
			>
				Create New List
			</Button>
		</CreateListDialog>
	);
}
