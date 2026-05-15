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
import { TrashIcon } from 'lucide-react';
import { humanFileSize } from '@/lib/file';
import { useUploaderContext } from './context';

export function AssetGrid() {
	const ctx = useUploaderContext();
	const files = ctx.uploader.acceptedFiles;
	const previews = files.map((f) => URL.createObjectURL(f));

	return (
		<ItemGroup {...ctx.uploader.getItemGroupProps()} className="gap-2">
			{files.map((f, i) => (
				<Item
					key={f.name}
					{...ctx.uploader.getItemProps({ file: f })}
					role="listitem"
					variant="outline"
				>
					<ItemMedia variant="default">
						<img
							src={previews[i] ?? ''}
							alt=""
							className="aspect-video w-16 rounded-md object-cover lg:w-32"
						/>
					</ItemMedia>
					<ItemContent>
						<ItemTitle
							className="line-clamp-1"
							{...ctx.uploader.getItemNameProps({ file: f })}
						>
							{f.name}
						</ItemTitle>
						<ItemDescription className="line-clamp-1 text-xs tracking-tighter">
							{humanFileSize(f.size)}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							variant="destructive"
							size="icon-sm"
							className="cursor-pointer"
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
