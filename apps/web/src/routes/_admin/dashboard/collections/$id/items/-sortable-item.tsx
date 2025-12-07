import { useSortable } from '@dnd-kit/react/sortable';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { GripVerticalIcon, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Outputs } from '@/lib/orpc';
import { DeleteItemDialog } from './-delete-item-dialog';

export function SortableItem({
	index,
	item,
}: {
	index: number;
	item: Outputs['collections']['get']['collection']['items'][number];
}) {
	const { ref, handleRef } = useSortable({
		id: item.placeId,
		index,
	});

	return (
		<div ref={ref}>
			<Item variant="outline" key={item.placeId}>
				<ItemActions>
					<div className="cursor-grabbing" ref={handleRef}>
						<GripVerticalIcon />
					</div>
				</ItemActions>
				<ItemMedia variant="image">
					<img src={item.place.assets[0]?.url ?? ''} alt="" />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{item.place.name}</ItemTitle>
					<ItemDescription>{item.place.category.name}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button
						variant="ghost"
						size="icon"
						onClick={async () => {
							await globalThis.window.navigator.clipboard.writeText(
								new URL(`/p/${item.placeId}`, location.origin).toString(),
							);
							toast.success('Link copied to clipboard');
						}}
					>
						<LinkIcon className="size-4" />
					</Button>

					<DeleteItemDialog
						collectionId={item.collectionId}
						placeName={item.place.name}
						placeId={item.placeId}
					/>
				</ItemActions>
			</Item>
		</div>
	);
}
