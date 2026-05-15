import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { ArrowLeftIcon, PlusIcon, Settings2Icon } from 'lucide-react';
import { Activity } from 'react';
import { useTopPlacesContext } from './context';
import { Search } from './search';
import { SortView } from './sort-view';

export function UpdateDialog() {
	const ctx = useTopPlacesContext();

	return (
		<Dialog open={ctx.open} onOpenChange={ctx.setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2Icon />
					<span className="sr-only">Edit top places</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Update Top Places</DialogTitle>
				</DialogHeader>
				<div className="grid min-h-75 grid-cols-1 gap-8">
					<Activity mode={ctx.mode === 'items' ? 'visible' : 'hidden'}>
						<SortView />
					</Activity>

					{ctx.mode === 'search' && <Search />}
				</div>
				<DialogFooter className="sm:justify-end">
					<Button
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							ctx.setMode((prev) => (prev === 'items' ? 'search' : 'items'));
						}}
						disabled={ctx.items.length === 4}
					>
						{ctx.mode === 'items' ? <PlusIcon /> : <ArrowLeftIcon />}
						{ctx.mode === 'items' ? 'Add Place' : 'View'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
