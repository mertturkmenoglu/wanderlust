import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';

type State = {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
};

export const CommentListContext = createContext<State | null>(null);

type Props = PropsWithChildren;

export function CommentListContextProvider({ children }: Props) {
	const [page, setPage] = useState(1);

	return (
		<CommentListContext.Provider
			value={{
				page,
				setPage,
			}}
		>
			{children}
		</CommentListContext.Provider>
	);
}

export function useCommentListContext() {
	const context = useContext(CommentListContext);

	if (!context) {
		throw new Error(
			'useCommentListContext must be used within a CommentListContextProvider',
		);
	}

	return context;
}
