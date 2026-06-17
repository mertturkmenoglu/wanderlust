import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { useAddToListContext } from './context';
import { useAddToListMutation } from './hooks';

export function AddButton() {
	const ctx = useAddToListContext();
	const mutation = useAddToListMutation();
	const { place } = useLoaderData({ from: '/p/$id/' });

	return (
		<Button
			type="button"
			variant="default"
			onClick={() => {
				if (!ctx.listId) {
					return;
				}
				mutation.mutate({
					id: ctx.listId,
					placeId: place.id,
				});
			}}
			disabled={ctx.listId === null}
		>
			Add to list
		</Button>
	);
}
