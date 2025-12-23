import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AppMessage } from '@/components/app-message';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { AddItemDialog } from './-add-item-dialog';
import { SortableItem } from './-sortable-item';

export const Route = createFileRoute(
	'/_admin/dashboard/collections/$id/items/',
)({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.collections.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { collection } = Route.useLoaderData();
	const invalidate = useInvalidator();

	const [items, setItems] = useState(collection.items);

	useEffect(() => {
		setItems(collection.items);
	}, [collection.items]);

	const updateMutation = useMutation(
		orpc.collections.reorderItems.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Collection items reordered successfully');
			},
		}),
	);

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Collections', href: '/dashboard/collections' },
					{
						name: collection.name,
						href: `/dashboard/collections/${collection.id}`,
					},
					{
						name: 'Items',
						href: `/dashboard/collections/${collection.id}/items`,
					},
				]}
			/>

			<Separator className="my-4" />

			<div className={cn('mt-4 grid grid-cols-1 gap-4', {})}>
				<DragDropProvider
					onDragEnd={(e) => {
						// @ts-expect-error sortable type should exists but it's missing, idk why
						const s = e.operation.source?.sortable;
						const initialIndex = s.initialIndex;
						const currentIndex = s.index;

						updateMutation.mutate({
							id: collection.id,
							placeIds: arrayMove(items, initialIndex, currentIndex).map(
								(item) => item.placeId,
							),
						});
					}}
				>
					<div className="flex">
						<AddItemDialog
							collectionId={collection.id}
							buttonClassName="ml-auto"
						/>
					</div>
					{items.map((item, i) => (
						<SortableItem key={item.placeId} item={item} index={i} />
					))}
				</DragDropProvider>

				{collection.items.length === 0 && (
					<AppMessage
						emptyMessage="This collection is empty"
						showBackButton={false}
						className="col-span-full my-8"
					/>
				)}
			</div>
		</>
	);
}
