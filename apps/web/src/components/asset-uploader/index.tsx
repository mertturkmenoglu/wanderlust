import { cn } from '@wanderlust/ui/lib/utils';
import { AssetGrid } from './asset-grid';
import { AssetSelector } from './asset-selector';
import { AssetUploaderStoreProvider, useUploaderStore } from './store';
import type { Props } from './types';

export function AssetUploader({ uploader, classNames }: Props) {
	return (
		<AssetUploaderStoreProvider uploader={uploader} classNames={classNames}>
			<Content />
		</AssetUploaderStoreProvider>
	);
}

function Content() {
	const uploader = useUploaderStore((s) => s.uploader);
	const classNames = useUploaderStore((s) => s.classNames);
	const hasFiles = uploader.acceptedFiles.length !== 0;

	return (
		<div className={cn(classNames?.root)}>
			{!hasFiles ? <AssetSelector /> : <AssetGrid />}
		</div>
	);
}
