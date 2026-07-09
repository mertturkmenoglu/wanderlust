import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import { Button } from '@wanderlust/ui/components/button';
import { Item, ItemActions, ItemContent } from '@wanderlust/ui/components/item';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { SortableListProvider, useSortableListContext } from './context';

type Props<T> = {
	initial: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	keyExtractor: (item: T) => string | number;
	onReorder: (items: T[]) => void;
	onRemove?: (item: T) => void;
};

export function SortableList<T>(props: Props<T>) {
	return (
		<SortableListProvider initial={props.initial}>
			<Content {...props} />
		</SortableListProvider>
	);
}

function Content<T>({
	renderItem,
	onReorder,
	onRemove,
	keyExtractor,
	initial,
}: Props<T>) {
	const ctx = useSortableListContext<T>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional.
	useEffect(() => {
		ctx.setItems(initial);
	}, [initial]);

	return (
		<DragDropProvider
			onDragEnd={(e) => {
				if (e.canceled) {
					return;
				}

				if (!isSortable(e.operation.source)) {
					return;
				}

				const src = e.operation.source.sortable;
				const initial = src.initialIndex;
				const current = src.index;
				const newArr = arrayMove(ctx.items, initial, current);

				onReorder(newArr);
			}}
		>
			{ctx.items.map((item, i) => (
				<SortableItem
					key={keyExtractor(item)}
					index={i}
					id={keyExtractor(item)}
					item={item}
					onRemove={onRemove}
				>
					{renderItem(item, i)}
				</SortableItem>
			))}
		</DragDropProvider>
	);
}

type SortableItemProps<T> = {
	index: number;
	children: React.ReactNode;
	id: string | number;
	item: T;
	onRemove?: (item: T) => void;
};

function SortableItem<T>({
	index,
	children,
	onRemove,
	item,
	id,
}: SortableItemProps<T>) {
	const { ref, handleRef } = useSortable({
		id,
		index,
	});

	const confirm = useConfirmDialog();

	return (
		<Item ref={ref} variant="outline" className="hover:bg-muted">
			{confirm.Dialog}

			<ItemActions>
				<div className="cursor-grabbing" ref={handleRef}>
					<GripVerticalIcon />
				</div>
			</ItemActions>

			<ItemContent>{children}</ItemContent>

			{onRemove !== undefined && (
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
								title: 'Remove Item',
								description: 'Are you sure you want to remove this item?',
								confirmText: 'Remove',
							});

							if (!ok) {
								return;
							}

							onRemove(item);
						}}
					>
						<Trash2Icon />
					</Button>
				</ItemActions>
			)}
		</Item>
	);
}
