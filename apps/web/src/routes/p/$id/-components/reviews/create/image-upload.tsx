import { Button } from '@wanderlust/ui/components/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wanderlust/ui/components/collapsible';
import { cn } from '@wanderlust/ui/lib/utils';
import { TrashIcon, UploadIcon } from 'lucide-react';
import { type UseUpload, usePreviews } from './hooks';

type Props = {
	up: UseUpload;
};

export function ImageUploadArea({ up }: Props) {
	const files = up.acceptedFiles;
	const previews = usePreviews(up);

	return (
		<Collapsible className="w-full">
			<CollapsibleTrigger className="w-full">
				<Button variant="ghost">
					<UploadIcon className="size-4" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="w-full">
				<div className="mt-2">
					{files.length === 0 ? (
						<div
							className="flex w-full cursor-pointer flex-col gap-2 text-center text-muted-foreground text-sm"
							{...up.getRootProps()}
						>
							<div
								{...up.getDropzoneProps()}
								className="rounded-md border border-border border-dashed p-8 py-32"
							>
								<input {...up.getHiddenInputProps()} />
								<span>Drag your file here</span>
								<div className="my-2 text-xs">(or)</div>
								<button
									type="button"
									{...up.getTriggerProps()}
									className="cursor-pointer"
								>
									Choose file
								</button>
								<div className="text-xs">PNG or JPEG files up to 5MB each.</div>
							</div>
						</div>
					) : (
						<div
							{...up.getItemGroupProps()}
							className={cn('grid gap-4', {
								'grid-cols-1': files.length === 1,
								'grid-cols-2': files.length >= 2,
							})}
						>
							{files.map((f, i) => (
								<div
									key={f.name}
									{...up.getItemProps({ file: f })}
									className="flex flex-col items-center gap-2"
								>
									<img
										src={previews[i] ?? ''}
										alt=""
										className="w-24 rounded-md object-cover"
									/>
									<div
										{...up.getItemNameProps({ file: f })}
										className="text-muted-foreground text-sm"
									>
										{f.name}
									</div>
									<Button
										variant="destructive"
										size="sm"
										className="cursor-pointer"
										{...up.getItemDeleteTriggerProps({ file: f })}
									>
										<TrashIcon className="size-3" />
										<span>Delete</span>
									</Button>
								</div>
							))}
						</div>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
