import { Link } from '@tanstack/react-router';
import { UserCardContextProvider } from './context';
import { DefaultVariant } from './default-variant';
import { ItemVariant } from './item-variant';
import type { Props } from './types';

export function UserCard(props: Props) {
	return (
		<UserCardContextProvider profile={props.profile} meta={props.meta}>
			<Content {...props} />
		</UserCardContextProvider>
	);
}

function Content(props: Props) {
	if (props.as === 'link') {
		return (
			<Link
				to="/u/$username"
				params={{
					username: props.profile.username,
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
