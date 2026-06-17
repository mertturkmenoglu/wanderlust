import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useUpload } from './-hooks';

type State = {
	showAssetUpload: boolean;
	setShowAssetUpload: Dispatch<SetStateAction<boolean>>;
	uploader: ReturnType<typeof useUpload>;
};

export const CreateReviewContext = createContext<State | null>(null);

export function CreateReviewContextProvider({ children }: PropsWithChildren) {
	const [showAssetUpload, setShowAssetUpload] = useState(false);
	const uploader = useUpload();

	return (
		<CreateReviewContext.Provider
			value={{
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
