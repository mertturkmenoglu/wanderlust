import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from 'react';
import { createStore, type ExtractState, useStore } from 'zustand';
import { combine } from 'zustand/middleware';
import type { AssetUploaderClassNames, TUploader } from './types';

function createAssetUploaderStore(
	uploader: TUploader,
	classNames: AssetUploaderClassNames,
) {
	return createStore(
		combine(
			{
				uploader,
				classNames,
			},
			() => ({}),
		),
	);
}

type AssetUploaderStoreApi = ReturnType<typeof createAssetUploaderStore>;

const Context = createContext<AssetUploaderStoreApi | null>(null);

export function AssetUploaderStoreProvider({
	uploader,
	children,
	classNames = {},
}: PropsWithChildren<ExtractState<AssetUploaderStoreApi>>) {
	const [store] = useState(() =>
		createAssetUploaderStore(uploader, classNames),
	);

	return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useUploaderStore<T>(
	selector: (state: ExtractState<AssetUploaderStoreApi>) => T,
) {
	const context = useContext(Context);

	if (!context) {
		throw new Error(
			'useUploaderStore must be used within an AssetUploaderStoreProvider',
		);
	}

	return useStore(context, selector);
}
