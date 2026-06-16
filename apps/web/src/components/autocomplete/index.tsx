import { Content } from './content';
import { AutocompleteContextProvider } from './context';
import type { AutocompleteProps } from './types';

export function Autocomplete(props: AutocompleteProps) {
	return (
		<AutocompleteContextProvider props={props}>
			<Content {...props} />
		</AutocompleteContextProvider>
	);
}
