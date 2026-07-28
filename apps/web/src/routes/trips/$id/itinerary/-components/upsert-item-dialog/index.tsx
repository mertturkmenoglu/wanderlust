import { Content } from './content';
import { ItineraryContextProvider } from './context';

export function UpsertItemDialog() {
	return (
		<ItineraryContextProvider>
			<Content />
		</ItineraryContextProvider>
	);
}
