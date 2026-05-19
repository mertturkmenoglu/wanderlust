import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { PencilIcon } from 'lucide-react';
import { useCreateReviewContext } from './context';
import { CreateReviewForm } from './form';
import { PlaceInfo } from './place-info';
import { Rate } from './rate';

export function Content() {
	const ctx = useCreateReviewContext();

	return (
		<AlertDialog open={ctx.open} onOpenChange={ctx.setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="default" size="sm">
					<PencilIcon className="mr-2 size-4" />
					<span>Add a review</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-5xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Add a review</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="grid gap-4 py-2 md:grid-cols-3">
					<div className="md:col-span-1">
						<PlaceInfo />

						<Rate />
					</div>

					<CreateReviewForm />
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button type="submit" form="create-review-form">
						Create
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
