import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { PlusIcon, Settings2Icon } from 'lucide-react';
import { Footer } from './footer';
import { Header } from './header';
import { useItineraryContext } from './hooks';
import { mux } from './mux';

export function Content() {
	const InnerContent = mux();
	const ctx = useItineraryContext();

	return (
		<AlertDialog open={ctx.open} onOpenChange={ctx.setOpen}>
			<AlertDialogTrigger
				render={
					ctx.mode === 'edit' ? (
						<Button className="ml-auto" variant="midnight" size="icon-sm">
							<Settings2Icon />
							<span className="sr-only">Update Itinerary Item</span>
						</Button>
					) : (
						<Button className="ml-auto" variant="secondary">
							<PlusIcon />
							<span>Add Itinerary Item</span>
						</Button>
					)
				}
			/>
			<AlertDialogContent className="md:min-w-3xl">
				<Header />
				<div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 py-4">
					<InnerContent />
				</div>
				<Footer />
			</AlertDialogContent>
		</AlertDialog>
	);
}
