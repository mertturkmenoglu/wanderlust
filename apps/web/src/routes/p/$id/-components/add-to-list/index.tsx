import { Content } from './content';
import { AddToListContextProvider } from './context';

export function AddToList() {
	return (
		<AddToListContextProvider>
			<Content />
		</AddToListContextProvider>
	);
}
