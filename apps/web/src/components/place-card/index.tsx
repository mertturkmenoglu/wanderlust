import { Link } from '@tanstack/react-router';
import { DefaultVariant } from './default-variant';
import { ItemVariant } from './item-variant';
import { PlaceStoreProvider } from './store';
import type { Props } from './types';

export function PlaceCard(props: Props) {
	return (
		<PlaceStoreProvider place={props.place} meta={props.meta}>
			<Content {...props} />
		</PlaceStoreProvider>
	);
}

function Content(props: Props) {
	if (props.as === 'link') {
		return (
			<Link
				to="/p/$id"
				params={{
					id: props.place.id,
				}}
			>
				{props.variant === 'item' ? (
					<ItemVariant {...props} />
				) : (
					<DefaultVariant {...props} />
				)}
			</Link>
		);
	}

	if (props.variant === 'item') {
		return <ItemVariant {...props} />;
	}

	return <DefaultVariant {...props} />;
}
