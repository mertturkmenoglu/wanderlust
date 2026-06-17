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
import { useUploaderContext } from './context';

export function AssetGrid() {
	const ctx = useUploaderContext();
	const files = ctx.uploader.acceptedFiles;
	const previews = files.map((f) => URL.createObjectURL(f));

	return (
		<ItemGroup
			{...ctx.uploader.getItemGroupProps()}
			className={cn('gap-2', ctx.classNames?.grid?.root)}
		>
			{files.map((f, i) => (
				<Item
					key={f.name}
					{...ctx.uploader.getItemProps({ file: f })}
					role="listitem"
					variant="outline"
					className={cn('hover:bg-muted', ctx.classNames?.grid?.item)}
				>
					<ItemMedia variant="default">
						<img
							src={previews[i] ?? ''}
							alt=""
							className={cn(
								'aspect-video w-16 rounded-md object-cover lg:w-32',
								ctx.classNames?.grid?.image,
							)}
						/>
					</ItemMedia>
					<ItemContent>
						<ItemTitle
							className={cn('line-clamp-1', ctx.classNames?.grid?.title)}
							{...ctx.uploader.getItemNameProps({ file: f })}
						>
							{f.name}
						</ItemTitle>
						<ItemDescription
							className={cn(
								'line-clamp-1 text-xs tracking-tighter',
								ctx.classNames?.grid?.description,
							)}
						>
							{humanFileSize(f.size)}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							variant="destructive"
							size="icon-sm"
							className={cn('cursor-pointer', ctx.classNames?.grid?.delete)}
							{...ctx.uploader.getItemDeleteTriggerProps({ file: f })}
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
