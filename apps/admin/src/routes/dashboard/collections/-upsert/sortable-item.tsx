import { useSortable } from '@dnd-kit/react/sortable';
import { useMutation } from '@tanstack/react-query';
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
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import type { Collection } from '@/resources/collections';

type Props = {
	index: number;
	item: Collection['items'][number];
};

export function SortableItem({ index, item }: Props) {
	const asset = item.place.assets[0];
	const invalidate = useInvalidator();

	const { ref, handleRef } = useSortable({
		id: item.placeId,
		index,
	});

	const mutation = useMutation(
		orpc.collections.removeItem.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Place removed from collection');
			},
		}),
	);

	const confirm = useConfirmDialog();

	return (
		<Item ref={ref} variant={'outline'} className="hover:bg-muted">
			{confirm.Dialog}

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
				<Button
					type="button"
					variant="destructive"
					size="icon"
					onClick={async (e) => {
						e.preventDefault();
						e.stopPropagation();

						const ok = await confirm.confirm({
							variant: 'destructive',
							title: 'Remove Place from Collection',
							description: (
								<>
									Are you sure you want to remove this place from the
									collection?
									<br />
									<br />
									{item.place.name}
								</>
							),
							confirmText: 'Remove',
						});

						if (!ok) {
							return;
						}

						mutation.mutate({
							id: item.collectionId,
							placeId: item.placeId,
						});
					}}
				>
					<Trash2Icon />
				</Button>
			</ItemActions>
		</Item>
	);
}
