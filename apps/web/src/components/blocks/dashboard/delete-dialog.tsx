import { ArrowRightIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';

type Props = {
	type: 'city' | 'collection' | 'amenity' | 'category' | 'draft' | 'report';
	onClick: () => void;
};

export function DeleteDialog({ type, onClick }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Item variant="outline" className="cursor-pointer hover:bg-muted">
					<ItemMedia variant="icon">
						<Trash2Icon className="text-destructive" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="text-destructive">Delete {type}</ItemTitle>
					</ItemContent>
					<ItemActions>
						<Button variant="ghost">
							<ArrowRightIcon className="text-destructive" />
						</Button>
					</ItemActions>
				</Item>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2 text-sm">
					Are you sure you want to delete this {type}? This action cannot be
					undone and all data will be permanently deleted.
				</div>
				<DialogFooter className="sm:justify-start">
					<Button type="button" variant="destructive" onClick={onClick}>
						Delete
					</Button>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
