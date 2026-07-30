import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { PlusIcon } from 'lucide-react';
import { Footer } from './footer';
import { Header } from './header';
import { useItineraryContext } from './hooks';
import { mux } from './mux';

export function Content() {
	const InnerContent = mux();
	const ctx = useItineraryContext();

	return (
		<Dialog open={ctx.open} onOpenChange={ctx.setOpen}>
			<DialogTrigger
				render={
					<Button className="ml-auto" variant="secondary">
						<PlusIcon />
						<span>Add Itinerary Item</span>
					</Button>
				}
			/>
			<DialogContent className="md:min-w-3xl">
				<Header />
				<div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 py-4">
					<InnerContent />
				</div>
				<Footer />
			</DialogContent>
		</Dialog>
	);
}
