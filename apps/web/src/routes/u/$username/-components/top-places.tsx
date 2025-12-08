import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { cn } from '@wanderlust/ui/lib/utils';
import { Settings2Icon } from 'lucide-react';
import { Activity, useEffect, useState } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import { Autocomplete } from '@/components/autocomplete';
import { PlaceCard } from '@/components/place-card';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { orpc } from '@/lib/orpc';
import { SortableItem } from './sortable-item';

type Props = {
	className?: string;
};

export function TopPlaces({ className }: Props) {
	const rootRoute = getRouteApi('/u/$username');
	const { profile, meta } = rootRoute.useLoaderData();
	const invalidate = useInvalidator();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<'items' | 'search'>('items');

	const {
		data: { places },
	} = useSuspenseQuery(
		orpc.users.listTopPlaces.queryOptions({
			input: {
				username: profile.username,
			},
		}),
	);

	const [items, setItems] = useState(places);

	useEffect(() => {
		setItems(places);
	}, [places]);

	const searchClient = useSearchClient();

	const isThisUser = meta.isSelf;

	const mutation = useMutation(
		orpc.users.updateTopPlaces.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Updated top places');
			},
		}),
	);

	return (
		<div className={cn(className)}>
			<div className="font-medium text-2xl">
				<span>Favorite Places</span>
				{isThisUser && (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="ghost" size="icon">
								<Settings2Icon />
								<span className="sr-only">Edit top places</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="">
							<DialogHeader>
								<DialogTitle>Update Top Places</DialogTitle>
							</DialogHeader>
							<div className="grid min-h-[300px] grid-cols-1 gap-8">
								<Activity mode={mode === 'items' ? 'visible' : 'hidden'}>
									<div className="space-y-2">
										<DragDropProvider
											onDragEnd={(e) => {
												// @ts-expect-error sortable type should exists but it's missing.
												const src = e.operation.source?.sortable;
												const initial = src.initialIndex;
												const current = src.index;
												const newArr = arrayMove(items, initial, current);

												mutation.mutate({
													placesIds: newArr.map((x) => x.id),
												});
											}}
										>
											{items.map((item, i) => (
												<SortableItem
													key={item.id}
													item={item}
													index={i}
													onRemoveClick={(placeId) => {
														const newItems = items.filter(
															(i) => i.id !== placeId,
														);

														mutation.mutate({
															placesIds: newItems.map((p) => p.id),
														});
													}}
												/>
											))}
										</DragDropProvider>
									</div>
								</Activity>

								{mode === 'search' && (
									<div>
										<InstantSearch
											indexName="places"
											searchClient={searchClient}
											routing={false}
											future={{
												preserveSharedStateOnUnmount: true,
											}}
										>
											<Autocomplete
												showAdvancedSearch={false}
												showAllResultsButton={false}
												isCardClickable
												onCardClick={(v) => {
													const maxAllowedCount = 4;
													const alreadyInList = items.some(
														(lo) => lo.id === v.id,
													);

													if (alreadyInList) {
														toast.error('Place is already added.');
														return;
													}

													if (items.length >= maxAllowedCount) {
														toast.error(
															`Maximum ${maxAllowedCount} places can be added.`,
														);
														return;
													}

													mutation.mutate({
														placesIds: [
															...items.map((place) => place.id),
															v.id,
														],
													});
													setMode('items');
												}}
											/>
										</InstantSearch>
									</div>
								)}
							</div>
							<DialogFooter className="sm:justify-end">
								<Button
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										setMode((prev) => (prev === 'items' ? 'search' : 'items'));
									}}
								>
									{mode === 'items' ? 'Add Place' : 'Switch to Items'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4">
				{items.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-4">
						<span className="text-muted-foreground">
							{isThisUser ? 'You' : 'This user'} haven&apos;t added any favorite
							locations yet.
						</span>
					</div>
				)}

				{items.map((place) => (
					<Link
						to="/p/$id"
						key={place.id}
						className={cn('flex flex-row items-center justify-between gap-4')}
						params={{
							id: place.id,
						}}
					>
						<PlaceCard key={place.id} place={place} />
					</Link>
				))}
			</div>
		</div>
	);
}
