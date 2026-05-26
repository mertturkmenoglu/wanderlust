import { useSortable } from '@dnd-kit/react/sortable';
import { Image } from '@unpic/react';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { GripVerticalIcon } from 'lucide-react';
import { useAsset } from '@/hooks/use-asset';
import { ipx } from '@/lib/ipx';
import type { ListItem } from './-hooks';
import { RemoveItemDialog } from './-remove-item-dialog';

type Props = {
	index: number;
	item: ListItem;
};

export function SortableItem({ index, item }: Props) {
	const asset = useAsset(item.place.assets);

	const { ref, handleRef } = useSortable({
		id: item.placeId,
		index,
	});

	return (
		<Item ref={ref} variant={'outline'} className="hover:bg-muted">
			<ItemActions>
				<div className="cursor-grabbing" ref={handleRef}>
					<GripVerticalIcon />
				</div>
			</ItemActions>

			<ItemMedia variant="default">
				<Image
					src={ipx(asset.url, 'w_512')}
					alt={asset.description ?? ''}
					layout="constrained"
					height={64}
					aspectRatio={16 / 9}
					className="aspect-video h-16 rounded-md object-cover"
				/>
			</ItemMedia>

			<ItemContent>
				<ItemTitle className="line-clamp-2" title={item.place.name}>
					{item.place.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-1">
					{item.place.address.city.name} / {item.place.address.city.countryName}
				</ItemDescription>
				<ItemDescription className="line-clamp-1 text-primary">
					{item.place.category.name}
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				<RemoveItemDialog item={item} />
			</ItemActions>
		</Item>
	);
}
