import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useTopPlacesContext } from './context';
import { useTopPlacesMutation } from './hooks';
import { SortableItem } from './sortable-item';

export function SortView() {
	const mutation = useTopPlacesMutation();
	const ctx = useTopPlacesContext();

	return (
		<div className="space-y-2">
			<DragDropProvider
				onDragEnd={(e) => {
					// @ts-expect-error sortable type should exists but it's missing.
					const src = e.operation.source?.sortable;
					const initial = src.initialIndex;
					const current = src.index;
					const newArr = arrayMove(ctx.items, initial, current);

					mutation.mutate({
						placesIds: newArr.map((x) => x.id),
					});
				}}
			>
				{ctx.items.map((item, i) => (
					<SortableItem
						key={item.id}
						item={item}
						index={i}
						onRemoveClick={(placeId) => {
							const newItems = ctx.items.filter((i) => i.id !== placeId);

							mutation.mutate({
								placesIds: newItems.map((p) => p.id),
							});
						}}
					/>
				))}
				{ctx.items.length === 0 && (
					<div className="mt-4 text-center text-gray-500">No places yet.</div>
				)}
			</DragDropProvider>
		</div>
	);
}
