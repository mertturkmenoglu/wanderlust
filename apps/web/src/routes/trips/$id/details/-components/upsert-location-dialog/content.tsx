import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { useUpsertLocationDialogContext } from './context';
import { Footer } from './footer';
import { useCloseDialog, useDialogTitle, useOpenDialog } from './hooks';
import { SearchView } from './search-view';
import { Trigger } from './trigger';
import { UpdateView } from './update-view';

export function Content() {
	const ctx = useUpsertLocationDialogContext();

	const closeDialog = useCloseDialog();

	const openDialog = useOpenDialog();

	const title = useDialogTitle();

	const onOpenChange = (open: boolean) => {
		if (open) {
			openDialog();
			return;
		}
		closeDialog();
	};

	return (
		<AlertDialog open={ctx.isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Trigger />
			</AlertDialogTrigger>
			<AlertDialogContent className="min-h-150">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{ctx.placeId !== undefined ? <UpdateView /> : <SearchView />}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Footer className="mt-auto" />
			</AlertDialogContent>
		</AlertDialog>
	);
}
