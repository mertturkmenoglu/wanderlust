import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AppMessage } from '@/components/app-message';
import type { UpsertProps } from '@/components/form/upsert';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import type { Collection } from '@/resources/collections';
import { AddDialog } from './add-dialog';
import { SortableItem } from './sortable-item';

export function TabItems({ action, entity }: UpsertProps<Collection>) {
	const [items, setItems] = useState(entity?.items ?? []);

	const invalidate = useInvalidator();

	const reorderMutation = useMutation(
		orpc.collections.items.reorder.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Collection items updated');
			},
		}),
	);

	useEffect(() => {
		setItems(entity?.items ?? []);
	}, [entity?.items]);

	if (action === 'create') {
		return null;
	}

	if (!entity) {
		return (
			<AppMessage
				emptyMessage="Collection not found"
				className="my-16"
				showBackButton={false}
			/>
		);
	}

	return (
		<div className="flex flex-col space-y-2">
			<AddDialog collectionId={entity.id} />
			<DragDropProvider
				onDragEnd={(e) => {
					// @ts-expect-error sortable type should exists but it's missing.
					const src = e.operation.source?.sortable;
					const initial = src.initialIndex;
					const current = src.index;
					const newArr = arrayMove(items, initial, current);

					if (!entity) {
						return;
					}

					reorderMutation.mutate({
						id: entity.id,
						placeIds: newArr.map((x) => x.placeId),
					});
				}}
			>
				{items.map((item, i) => (
					<SortableItem key={item.placeId} item={item} index={i} />
				))}

				{entity?.items.length === 0 && (
					<AppMessage
						emptyMessage="This collection has no items yet. Add some items to get started."
						className="my-16"
						showBackButton={false}
					/>
				)}
			</DragDropProvider>
		</div>
	);
}
