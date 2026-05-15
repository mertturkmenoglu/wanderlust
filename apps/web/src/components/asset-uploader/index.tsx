import { cn } from '@wanderlust/ui/lib/utils';
import { AssetGrid } from './asset-grid';
import { AssetSelector } from './asset-selector';
import { AssetUploaderContextProvider, useUploaderContext } from './context';
import type { Props } from './types';

export function AssetUploader({ uploader, className }: Props) {
	return (
		<AssetUploaderContextProvider uploader={uploader}>
			<Content className={className} />
		</AssetUploaderContextProvider>
	);
}

function Content({ className }: { className?: string }) {
	const ctx = useUploaderContext();
	const hasFiles = ctx.uploader.acceptedFiles.length !== 0;

	return (
		<div className={cn(className)}>
			{!hasFiles ? <AssetSelector /> : <AssetGrid />}
		</div>
	);
}
