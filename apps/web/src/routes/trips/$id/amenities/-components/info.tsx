import { Alert, AlertDescription } from '@wanderlust/ui/components/alert';
import { CircleQuestionMarkIcon } from 'lucide-react';

export function Info() {
	return (
		<Alert>
			<CircleQuestionMarkIcon />

			<AlertDescription>
				These are the amenities that have been requested for this trip. When you
				add a place to this trip, we will notify you if it does not satisfy the
				requested amenities.
				<br />
				<br />
				Contact with the trip owner to add or remove amenities from this list.
			</AlertDescription>
		</Alert>
	);
}
