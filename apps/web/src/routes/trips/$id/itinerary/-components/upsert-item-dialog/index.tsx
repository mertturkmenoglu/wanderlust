import { Content } from './content';
import { ItineraryContextProvider } from './context';
import type { UpsertItemDialogProps } from './types';

export function UpsertItemDialog(props: UpsertItemDialogProps) {
	return (
		<ItineraryContextProvider item={props.item}>
			<Content />
		</ItineraryContextProvider>
	);
}
