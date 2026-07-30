import { AlertDialogFooter } from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { ArrowLeftIcon, CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { useItineraryContext } from './hooks';

export function Footer() {
	const ctx = useItineraryContext();

	const showPrimaryButton = ctx.type !== null;
	const AuxIcon =
		ctx.mode === 'edit' || ctx.type === null ? XIcon : ArrowLeftIcon;
	const auxText = ctx.type === null || ctx.mode === 'edit' ? 'Cancel' : 'Back';
	const auxOnClick = () => {
		if (ctx.type === null || ctx.mode === 'edit') {
			ctx.setOpen(false);
		} else {
			ctx.setType(null);
		}
	};

	return (
		<AlertDialogFooter className="sm:justify-between">
			<Button type="button" onClick={auxOnClick} variant="secondary">
				<AuxIcon />
				<span>{auxText}</span>
			</Button>

			{showPrimaryButton && (
				<Button type="submit" form="itinerary-form" className="ml-auto">
					<span>{ctx.mode === 'edit' ? 'Update' : 'Add'}</span>
					{ctx.mode === 'edit' ? <CheckIcon /> : <PlusIcon />}
				</Button>
			)}
		</AlertDialogFooter>
	);
}
