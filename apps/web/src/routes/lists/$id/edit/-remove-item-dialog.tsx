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
import { type ListItem, useRemoveListItemMutation } from './-hooks';

type Props = {
	item: ListItem;
};

export function RemoveItemDialog({ item }: Props) {
	const [open, setOpen] = useState(false);
	const mutation = useRemoveListItemMutation();

	const onRemoveClick = () => {
		mutation.mutate(
			{
				id: item.listId,
				placeId: item.placeId,
			},
			{
				onSuccess: () => setOpen(false),
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="icon">
					<TrashIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Remove Place from List</DialogTitle>
				</DialogHeader>
				<div className="text-sm">
					<div>Are you sure you want to remove this place from the list?</div>
					<div className="mt-2 font-bold">{item.place.name}</div>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button type="button" variant="destructive" onClick={onRemoveClick}>
						Remove
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
