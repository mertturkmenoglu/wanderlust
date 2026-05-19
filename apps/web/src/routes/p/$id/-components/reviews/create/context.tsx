import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useUpload } from './hooks';

type State = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	showAssetUpload: boolean;
	setShowAssetUpload: Dispatch<SetStateAction<boolean>>;
	uploader: ReturnType<typeof useUpload>;
};

export const CreateReviewContext = createContext<State | null>(null);

export function CreateReviewContextProvider({ children }: PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const [showAssetUpload, setShowAssetUpload] = useState(false);
	const uploader = useUpload();

	return (
		<CreateReviewContext.Provider
			value={{
				open,
				setOpen,
				showAssetUpload,
				setShowAssetUpload,
				uploader,
			}}
		>
			{children}
		</CreateReviewContext.Provider>
	);
}

export function useCreateReviewContext() {
	const context = useContext(CreateReviewContext);

	if (!context) {
		throw new Error(
			'useCreateReviewContext must be used within a CreateReviewContextProvider',
		);
	}

	return context;
}
