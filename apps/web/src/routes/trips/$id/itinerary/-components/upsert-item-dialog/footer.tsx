import { Button } from '@wanderlust/ui/components/button';
import { DialogFooter } from '@wanderlust/ui/components/dialog';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { useItineraryContext } from './hooks';

export function Footer() {
	const ctx = useItineraryContext();

	if (ctx.type === null) {
		return null;
	}

	return (
		<DialogFooter className="sm:justify-between">
			<Button
				type="button"
				onClick={() => ctx.setType(null)}
				variant="secondary"
			>
				<ArrowLeftIcon />
				<span>Back</span>
			</Button>

			<Button type="submit" form="itinerary-form">
				<span>Add</span>
				<PlusIcon />
			</Button>
		</DialogFooter>
	);
}
