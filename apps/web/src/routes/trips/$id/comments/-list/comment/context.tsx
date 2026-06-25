import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useIsCommentOwner, useIsPrivilegedStatus } from './hooks';
import type { CommentProps, TComment } from './types';

type State = {
	isEditMode: boolean;
	setIsEditMode: Dispatch<SetStateAction<boolean>>;
	comment: TComment;
	isPrivileged: boolean;
	isOwner: boolean;
	canSeeActions: boolean;
	canEdit: boolean;
};

export const CommentContext = createContext<State | null>(null);

type Props = PropsWithChildren & CommentProps;

export function CommentContextProvider({ comment, children }: Props) {
	const [isEditMode, setIsEditMode] = useState(false);
	const isPrivileged = useIsPrivilegedStatus();
	const isOwner = useIsCommentOwner(comment);
	const canSeeActions = isOwner || isPrivileged;
	const canEdit = isOwner;

	return (
		<CommentContext.Provider
			value={{
				isEditMode,
				setIsEditMode,
				comment,
				isPrivileged,
				isOwner,
				canSeeActions,
				canEdit,
			}}
		>
			{children}
		</CommentContext.Provider>
	);
}

export function useCommentContext() {
	const context = useContext(CommentContext);

	if (!context) {
		throw new Error(
			'useCommentContext must be used within a CommentContextProvider',
		);
	}

	return context;
}
