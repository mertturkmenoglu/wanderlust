import type { RefinementListRenderState } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useMemo,
} from 'react';
import {
	useLimit,
	useRefinementList,
	useRefinementTitle,
	useSearchPlaceholder,
	useShowInput,
	useShowMoreLimit,
} from './hooks';
import type { RefinementListAttribute } from './types';

type State = {
	attribute: RefinementListAttribute;
	title: string;
	renderMoreButton: boolean;
	limit: number;
	showMoreLimit: number;
	rl: RefinementListRenderState;
	searchPlaceholder: string;
	showInput: boolean;
};

export const RefinementListContext = createContext<State | null>(null);

type Props = PropsWithChildren<{
	attribute: RefinementListAttribute;
}>;

export function RefinementListContextProvider({ attribute, children }: Props) {
	const rl = useRefinementList(attribute);
	const title = useRefinementTitle(attribute);
	const searchPlaceholder = useSearchPlaceholder(attribute);
	const showInput = useShowInput(attribute);
	const limit = useLimit(attribute);
	const showMoreLimit = useShowMoreLimit(attribute);

	const renderMoreButton = useMemo(() => {
		const dontRender: RefinementListAttribute[] = [
			'place.priceLevel',
			'place.accessibilityLevel',
		];
		return !dontRender.includes(attribute) && rl.items.length >= limit;
	}, [limit, attribute, rl.items]);

	return (
		<RefinementListContext.Provider
			value={{
				rl,
				attribute,
				title,
				searchPlaceholder,
				showInput,
				limit,
				showMoreLimit,
				renderMoreButton,
			}}
		>
			{children}
		</RefinementListContext.Provider>
	);
}

export function useRefinementListContext() {
	const context = useContext(RefinementListContext);

	if (!context) {
		throw new Error(
			'useRefinementListContext must be used within a RefinementListContextProvider',
		);
	}

	return context;
}
