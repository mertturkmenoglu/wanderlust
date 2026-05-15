import { useUploaderContext } from './context';

export function AssetSelector() {
	const ctx = useUploaderContext();

	return (
		<div
			className="flex w-full cursor-pointer flex-col gap-2 text-center text-muted-foreground text-sm"
			{...ctx.uploader.getRootProps()}
		>
			<div
				{...ctx.uploader.getDropzoneProps()}
				className="rounded-md border border-border border-dashed p-8 py-12 md:py-32"
			>
				<input {...ctx.uploader.getHiddenInputProps()} />
				<span>Drag your file here</span>
				<div className="my-2 text-xs">(or)</div>
				<button
					type="button"
					{...ctx.uploader.getTriggerProps()}
					className="cursor-pointer"
				>
					Choose file
				</button>
				<div className="text-xs">PNG or JPEG files up to 5MB each.</div>
			</div>
		</div>
	);
}
