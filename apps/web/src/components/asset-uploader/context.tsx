import { createContext, type PropsWithChildren, useContext } from 'react';
import type { TUploader } from './types';

type State = {
	uploader: TUploader;
};

export const AssetUploaderContext = createContext<State | null>(null);

export function AssetUploaderContextProvider({
	uploader,
	children,
}: PropsWithChildren<State>) {
	return (
		<AssetUploaderContext.Provider value={{ uploader }}>
			{children}
		</AssetUploaderContext.Provider>
	);
}

export function useUploaderContext() {
	const context = useContext(AssetUploaderContext);

	if (!context) {
		throw new Error(
			'useUploaderContext must be used within a AssetUploaderContextProvider',
		);
	}

	return context;
}
