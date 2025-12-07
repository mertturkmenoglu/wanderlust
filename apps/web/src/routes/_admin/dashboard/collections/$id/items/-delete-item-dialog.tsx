import { useMutation } from '@tanstack/react-query';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

type Props = {
	collectionId: string;
	placeName: string;
	placeId: string;
};

export function DeleteItemDialog({ collectionId, placeName, placeId }: Props) {
	const invalidate = useInvalidator();
	const [open, setOpen] = useState(false);

	const mutation = useMutation(
		orpc.collections.removeItem.mutationOptions({
			onSuccess: async () => {
				toast.success('Item removed from collection');
				await invalidate();
				setOpen(false);
			},
		}),
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="icon">
					<TrashIcon className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Remove Item from Collection</DialogTitle>
				</DialogHeader>
				<div className="text-sm">
					<div>
						Are you sure you want to remove this item from the collection?
					</div>
					<div className="mt-2 font-bold">{placeName}</div>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						onClick={() =>
							mutation.mutate({
								id: collectionId,
								placeId,
							})
						}
					>
						Remove
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
