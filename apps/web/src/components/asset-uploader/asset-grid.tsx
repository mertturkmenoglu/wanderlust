import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { TrashIcon } from 'lucide-react';
import { humanFileSize } from '@/lib/file';
import { useUploaderStore } from './store';

export function AssetGrid() {
	const uploader = useUploaderStore((s) => s.uploader);
	const classNames = useUploaderStore((s) => s.classNames);
	const files = uploader.acceptedFiles;
	const previews = files.map((f) => URL.createObjectURL(f));

	return (
		<ItemGroup
			{...uploader.getItemGroupProps()}
			className={cn('gap-2', classNames?.grid?.root)}
		>
			{files.map((f, i) => (
				<Item
					key={f.name}
					{...uploader.getItemProps({ file: f })}
					role="listitem"
					variant="outline"
					className={cn('hover:bg-muted', classNames?.grid?.item)}
				>
					<ItemMedia variant="default">
						<img
							src={previews[i] ?? ''}
							alt=""
							className={cn(
								'aspect-video w-16 rounded-md object-cover lg:w-32',
								classNames?.grid?.image,
							)}
						/>
					</ItemMedia>
					<ItemContent>
						<ItemTitle
							className={cn('line-clamp-1', classNames?.grid?.title)}
							{...uploader.getItemNameProps({ file: f })}
						>
							{f.name}
						</ItemTitle>
						<ItemDescription
							className={cn(
								'line-clamp-1 text-xs tracking-tighter',
								classNames?.grid?.description,
							)}
						>
							{humanFileSize(f.size)}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							variant="destructive"
							size="icon-sm"
							className={cn('cursor-pointer', classNames?.grid?.delete)}
							{...uploader.getItemDeleteTriggerProps({ file: f })}
						>
							<TrashIcon />
							<span className="sr-only">Delete</span>
						</Button>
					</ItemActions>
				</Item>
			))}
		</ItemGroup>
	);
}
