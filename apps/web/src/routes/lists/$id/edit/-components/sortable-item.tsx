import { useSortable } from '@dnd-kit/react/sortable';
import { useMutation } from '@tanstack/react-query';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { GripVerticalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	index: number;
	item: Outputs['lists']['get']['list']['items'][number];
};

export function SortableItem({ index, item }: Props) {
	const invalidate = useInvalidator();
	const [open, setOpen] = useState(false);

	const { ref, handleRef } = useSortable({
		id: item.placeId,
		index,
	});

	const mutation = useMutation(
		orpc.lists.removeItem.mutationOptions({
			onSuccess: async () => {
				toast.success('Place removed from list');
				await invalidate();
				setOpen(false);
			},
		}),
	);

	return (
		<Item ref={ref} variant={'outline'} className="hover:bg-muted">
			<ItemActions>
				<div className="cursor-grabbing" ref={handleRef}>
					<GripVerticalIcon />
				</div>
			</ItemActions>

			<ItemMedia variant="default">
				<Image
					src={ipx(item.place.assets[0]?.url ?? '', 'w_512')}
					alt={item.place.assets[0]?.description ?? ''}
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
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant="destructive" size="icon">
							<TrashIcon />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-xl">
						<DialogHeader>
							<DialogTitle>Remove Place from List</DialogTitle>
						</DialogHeader>
						<div className="text-sm">
							<div>
								Are you sure you want to remove this place from the list?
							</div>
							<div className="mt-2 font-bold">{item.place.name}</div>
						</div>
						<DialogFooter className="sm:justify-end">
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Close
								</Button>
							</DialogClose>
							<Button
								type="button"
								variant="destructive"
								onClick={() =>
									mutation.mutate({
										id: item.listId,
										placeId: item.placeId,
									})
								}
							>
								Remove
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</ItemActions>
		</Item>
	);
}
