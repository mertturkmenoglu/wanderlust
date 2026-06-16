import { Content } from './content';
import { RefinementListContextProvider } from './context';
import type { RefinementListProps } from './types';

export function RefinementList(props: RefinementListProps) {
	return (
		<RefinementListContextProvider attribute={props.attribute}>
			<Content {...props} />
		</RefinementListContextProvider>
	);
}
