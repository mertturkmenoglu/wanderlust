import { cn } from '@wanderlust/ui/lib/utils';
import { ImagePlusIcon } from 'lucide-react';
import { useUploaderContext } from './context';

export function AssetSelector() {
	const ctx = useUploaderContext();

	return (
		<div
			className={cn(
				'flex w-full cursor-pointer flex-col gap-2 bg-muted text-center text-muted-foreground text-sm',
				ctx.classNames?.selector?.root,
			)}
			{...ctx.uploader.getRootProps()}
		>
			<div
				{...ctx.uploader.getDropzoneProps()}
				className={cn(
					'rounded-md border border-border border-dashed p-8 py-12 md:py-32',
					ctx.classNames?.selector?.dropzone,
				)}
			>
				<ImagePlusIcon className="mx-auto mb-2" />
				<input {...ctx.uploader.getHiddenInputProps()} />
				<span className="font-bold">Click to add</span>
				<div className="text-xs">(or)</div>
				<button
					type="button"
					{...ctx.uploader.getTriggerProps()}
					className={cn('cursor-pointer', ctx.classNames?.selector?.trigger)}
				>
					drag and drop
				</button>
				<div className="mt-2 text-xs">PNG or JPEG files up to 5MB each.</div>
			</div>
		</div>
	);
}
