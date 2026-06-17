import { cn } from '@wanderlust/ui/lib/utils';
import { AssetGrid } from './asset-grid';
import { AssetSelector } from './asset-selector';
import { AssetUploaderContextProvider, useUploaderContext } from './context';
import type { Props } from './types';

export function AssetUploader({ uploader, classNames }: Props) {
	return (
		<AssetUploaderContextProvider uploader={uploader} classNames={classNames}>
			<Content />
		</AssetUploaderContextProvider>
	);
}

function Content() {
	const ctx = useUploaderContext();
	const hasFiles = ctx.uploader.acceptedFiles.length !== 0;

	return (
		<div className={cn(ctx.classNames?.root)}>
			{!hasFiles ? <AssetSelector /> : <AssetGrid />}
		</div>
	);
}
