import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@wanderlust/ui/components/dialog';
import { AddButton } from './button';
import { useAddToListContext } from './context';
import { CreateList } from './create';
import { ListSelect } from './select';
import { Trigger } from './trigger';

export function Content() {
	const ctx = useAddToListContext();

	return (
		<Dialog open={ctx.open} onOpenChange={ctx.setOpen}>
			<Trigger />
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Select a list</DialogTitle>
					<DialogDescription className="w-full">
						<ListSelect />
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:flex sm:justify-between">
					<CreateList />
					<AddButton />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
