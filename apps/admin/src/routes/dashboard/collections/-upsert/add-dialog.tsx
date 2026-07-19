import { useDebouncedValue } from '@tanstack/react-pacer';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PlaceCard } from '@/components/place-card';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { SearchService, type TPlaceHit } from '@/lib/search';

type Props = {
	collectionId: string;
};

export function AddDialog({ collectionId }: Props) {
	const [search] = useState(() =>
		new SearchService<TPlaceHit>().getPlacesAdapter(),
	);

	const [open, setOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [debounced] = useDebouncedValue(searchTerm, {
		wait: 500,
	});

	const invalidate = useInvalidator();

	const query = useQuery({
		queryKey: ['search-places', debounced],
		queryFn: async () => {
			return search.typesenseClient
				.collections<TPlaceHit>('places')
				.documents()
				.search(
					{
						q: debounced,
						query_by: [
							'name',
							'place.description',
							'place.category.name',
							'place.address.city.name',
							'place.address.city.countryName',
						].join(','),
					},
					{},
				);
		},
		enabled: debounced.length > 0,
	});

	const mutation = useMutation(
		orpc.collections.items.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Place added to collection');
				setSelectedId(null);
				setSearchTerm('');
				setOpen(false);
			},
		}),
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button className="ml-auto w-64">
						<PlusIcon />
						Add Place
					</Button>
				}
			/>
			<AlertDialogContent className="w-full min-w-xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Add Place to Collection</AlertDialogTitle>
					<AlertDialogDescription>Search for a place</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col space-y-2">
					<Input
						placeholder="Search for a place"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{query.isLoading && <div>Loading...</div>}
					{query.isError && <div>Error: {query.error.message}</div>}
					{(query.data?.hits ?? []).slice(0, 5).map((hit) => (
						<button
							type="button"
							className={cn('w-full text-left', {
								'bg-primary/10': selectedId === hit.document.place.id,
							})}
							key={hit.document.place.id}
							onClick={() =>
								setSelectedId((prev) =>
									prev === hit.document.place.id ? null : hit.document.place.id,
								)
							}
						>
							<PlaceCard place={hit.document.place} variant="item" />
						</button>
					))}
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={!selectedId}
						onClick={() => {
							if (!selectedId) {
								return;
							}

							mutation.mutate({
								id: collectionId,
								update: {
									op: 'add',
									items: [selectedId],
								},
							});
						}}
					>
						Add
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
