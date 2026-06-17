import { createContext, type PropsWithChildren, useContext } from 'react';
import type { AssetUploaderClassNames, TUploader } from './types';

type State = {
	uploader: TUploader;
	classNames: AssetUploaderClassNames;
};

export const AssetUploaderContext = createContext<State | null>(null);

export function AssetUploaderContextProvider({
	uploader,
	children,
	classNames = {},
}: PropsWithChildren<State>) {
	return (
		<AssetUploaderContext.Provider value={{ uploader, classNames }}>
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
