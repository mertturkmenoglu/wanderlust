import { useNavigate } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { MapIcon, PlusIcon } from 'lucide-react';
import { usePlanTripDialogContext } from './context';

export function ChooseView() {
	const ctx = usePlanTripDialogContext();
	const navigate = useNavigate({ from: '/p/$id/' });

	return (
		<div className="grid grid-cols-2 gap-4">
			<button
				type="button"
				className={cn(
					'flex aspect-square flex-col items-center justify-center gap-4 rounded-md bg-muted p-4',
					'font-medium',
					'group transition-all duration-300 ease-in-out hover:bg-primary hover:text-white',
				)}
				onClick={() => {
					navigate({
						to: '/trips',
						search: () => ({ showNewDialog: true }),
					});
				}}
			>
				<PlusIcon className="size-6 text-primary group-hover:text-white" />
				<span>New Trip</span>
			</button>

			<button
				type="button"
				className={cn(
					'flex aspect-square flex-col items-center justify-center gap-4 rounded-md bg-muted p-4',
					'font-medium',
					'group transition-all duration-300 ease-in-out hover:bg-primary hover:text-white',
				)}
				onClick={() => ctx.setView('add-to-trip')}
			>
				<MapIcon className="size-6 text-primary group-hover:text-white" />
				<span>Add to Existing Trip</span>
			</button>
		</div>
	);
}
