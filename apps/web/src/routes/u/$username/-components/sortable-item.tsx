import { useSortable } from '@dnd-kit/react/sortable';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';

type Props = {
	index: number;
	item: Outputs['places']['get']['place'];
	onRemoveClick: (placeId: string) => void | Promise<void>;
};

export function SortableItem({ index, item, onRemoveClick }: Props) {
	const { ref, handleRef } = useSortable({
		id: item.id,
		index,
	});

	return (
		<Item ref={ref} variant={'outline'} className="hover:bg-muted">
			<ItemActions>
				<div className="cursor-grabbing" ref={handleRef}>
					<GripVerticalIcon />
				</div>
			</ItemActions>

			<ItemMedia variant="image">
				<Image
					src={ipx(item.assets[0]?.url ?? '', 'w_512')}
					alt={item.assets[0]?.description ?? ''}
					width={512}
					aspectRatio={16 / 9}
				/>
			</ItemMedia>

			<ItemContent>
				<ItemTitle>{item.name}</ItemTitle>
				<ItemDescription>{item.category.name}</ItemDescription>
			</ItemContent>

			<ItemActions>
				<Button
					type="button"
					variant="destructive"
					onClick={() => onRemoveClick(item.id)}
				>
					<Trash2Icon />
					<span className="sr-only">Remove</span>
				</Button>
			</ItemActions>
		</Item>
	);
}
