import { useDebouncedValue } from '@tanstack/react-pacer';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	ButtonGroup,
	ButtonGroupText,
} from '@wanderlust/ui/components/button-group';
import { Input } from '@wanderlust/ui/components/input';
import {
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Activity, useState } from 'react';
import { toast } from 'sonner';
import { AppMessage } from '@/components/app-message';
import { CollectionCard } from '@/components/collection-card';
import { EditDialog } from '@/components/edit-dialog';
import { SortableList } from '@/components/sortable-list';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { orpc } from '@/lib/orpc';
import { placesResource as r } from '@/resources/places';

export const Route = createFileRoute('/dashboard/places/$id/collections')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'edit'),
});

function RouteComponent() {
	const params = Route.useParams();
	const [mode, setMode] = useState<'list' | 'new'>('list');

	return (
		<EditDialog id={params.id} resource={r}>
			<ButtonGroup>
				<ButtonGroupText>Action</ButtonGroupText>
				<Button
					variant={mode === 'list' ? 'default' : 'outline'}
					onClick={() => setMode('list')}
				>
					Manage
				</Button>
				<Button
					variant={mode === 'new' ? 'default' : 'outline'}
					onClick={() => setMode('new')}
				>
					Add
				</Button>
			</ButtonGroup>

			<SuspenseWrapper>
				<Activity mode={mode === 'list' ? 'visible' : 'hidden'}>
					<List />
				</Activity>

				<Activity mode={mode === 'new' ? 'visible' : 'hidden'}>
					<New />
				</Activity>
			</SuspenseWrapper>
		</EditDialog>
	);
}

function List() {
	const params = Route.useParams();

	const query = useSuspenseQuery(
		orpc.collections.places.list.queryOptions({
			input: {
				placeId: params.id,
			},
		}),
	);

	const removeMutation = useMutation(
		orpc.collections.places.remove.mutationOptions({
			onSuccess: async () => {
				await query.refetch();
				toast.success('Collection place relation removed successfully');
			},
		}),
	);

	const reorderMutation = useMutation(
		orpc.collections.places.reorder.mutationOptions({
			onSuccess: async () => {
				await query.refetch();
				toast.success('Collection items updated');
			},
		}),
	);

	const collections = query.data.collections;
	const isEmpty = collections.length === 0;

	if (isEmpty) {
		return (
			<AppMessage
				emptyMessage="There are no featured collections for this place yet."
				showBackButton={false}
				className="my-16"
			/>
		);
	}

	return (
		<div>
			<div className="my-4">Featured collections for this place:</div>
			<ItemGroup className="mt-4 gap-2">
				<SortableList
					initial={collections}
					onRemove={(item) => {
						removeMutation.mutate({
							placeId: params.id,
							collectionId: item.id,
						});
					}}
					onReorder={(items) => {
						reorderMutation.mutate({
							placeId: params.id,
							collectionIds: items.map((x) => x.id),
						});
					}}
					renderItem={(item) => {
						return (
							<div>
								<ItemTitle>{item.name}</ItemTitle>
								<ItemDescription>
									<Link
										to="/dashboard/collections/$id"
										params={{
											id: item.id,
										}}
									>
										View
									</Link>
								</ItemDescription>
							</div>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</ItemGroup>
		</div>
	);
}

function New() {
	const invalidate = useInvalidator();
	const params = Route.useParams();
	const [term, setTerm] = useState('');
	const [debounced] = useDebouncedValue(term, {
		wait: 500,
	});

	const query = useQuery(
		orpc.collections.list.queryOptions({
			input: {
				page: 1,
				pageSize: 30,
				filter: {
					filters: [
						{
							field: 'name',
							operator: 'ilike',
							value: debounced,
						},
					],
				},
				sort: {
					field: 'name',
					order: 'asc',
				},
			},
			enabled: debounced.length > 0,
		}),
	);

	const mutation = useMutation(
		orpc.collections.places.append.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Collection place relation created successfully');
				setTerm('');
			},
		}),
	);

	return (
		<div>
			<Input
				className="my-4 w-full"
				placeholder="Search collections..."
				value={term}
				onChange={(e) => setTerm(e.target.value)}
			/>
			{query.isLoading && <div>Loading</div>}
			{query.isError && <div>Error: {query.error.message}</div>}
			{query.data && (
				<>
					{query.data.collections.length === 0 && (
						<div>No collections found.</div>
					)}
					{query.data.collections.length > 0 && (
						<ItemGroup className="mt-4 gap-2">
							{query.data.collections.map((collection) => (
								<button
									key={collection.id}
									className="w-full text-left"
									type="button"
									onClick={() => {
										mutation.mutate({
											placeId: params.id,
											collectionId: collection.id,
										});
									}}
								>
									<CollectionCard
										key={collection.id}
										collection={collection}
										className="hover:bg-muted"
									/>
								</button>
							))}
						</ItemGroup>
					)}
				</>
			)}
		</div>
	);
}
