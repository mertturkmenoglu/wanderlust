import { Content } from './content';
import { PlanTripDialogContextProvider } from './context';
import type { PlanTripDialogProps } from './types';

export function PlanTripDialog(props: PlanTripDialogProps) {
	return (
		<PlanTripDialogContextProvider>
			<Content {...props} />
		</PlanTripDialogContextProvider>
	);
}
