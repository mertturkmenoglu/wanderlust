import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AppMessage } from '@/components/app-message';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { SortableItem } from './sortable-item';

type Props = {
	className?: string;
};

export function EditItems({ className }: Props) {
	const invalidate = useInvalidator();
	const { list } = useLoaderData({
		from: '/lists/$id/edit/',
	});

	const [items, setItems] = useState(list.items);

	useEffect(() => {
		setItems(list.items);
	}, [list.items]);

	const mutation = useMutation(
		orpc.lists.updateItems.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List items updated');
			},
		}),
	);

	const initialIsEmpty = list.items.length === 0;

	if (initialIsEmpty) {
		return (
			<AppMessage
				emptyMessage="This list is empty. Add some items to get started."
				className={cn('my-16', className)}
				showBackButton={false}
			/>
		);
	}

	return (
		<div className={cn('flex flex-col space-y-2', className)}>
			<DragDropProvider
				onDragEnd={(e) => {
					// @ts-expect-error sortable type should exists but it's missing.
					const src = e.operation.source?.sortable;
					const initial = src.initialIndex;
					const current = src.index;
					const newArr = arrayMove(items, initial, current);

					mutation.mutate({
						id: list.id,
						placeIds: newArr.map((x) => x.placeId),
					});
				}}
			>
				{items.map((item, i) => (
					<SortableItem key={item.placeId} item={item} index={i} />
				))}
			</DragDropProvider>
		</div>
	);
}
