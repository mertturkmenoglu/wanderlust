import { PlaceCardContextProvider } from './context';
import { DefaultVariant } from './default-variant';
import { ItemVariant } from './item-variant';
import type { Props } from './types';

export function PlaceCard(props: Props) {
	return (
		<PlaceCardContextProvider place={props.place}>
			<Content {...props} />
		</PlaceCardContextProvider>
	);
}

function Content(props: Props) {
	if (props.variant === 'item') {
		return <ItemVariant {...props} />;
	}

	return <DefaultVariant {...props} />;
}
