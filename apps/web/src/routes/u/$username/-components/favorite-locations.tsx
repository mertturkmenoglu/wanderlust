import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	ChevronDownIcon,
	ChevronUpIcon,
	Settings2Icon,
	XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import { Autocomplete } from '@/components/autocomplete';
import { PlaceCard } from '@/components/place-card';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { orpc } from '@/lib/orpc';

type Props = {
	className?: string;
};

export function FavoriteLocations({ className }: Props) {
	const rootRoute = getRouteApi('/u/$username');
	const { profile, meta } = rootRoute.useLoaderData();
	const invalidate = useInvalidator();
	const {
		data: { places },
	} = useSuspenseQuery(
		orpc.users.listTopPlaces.queryOptions({
			input: {
				username: profile.username,
			},
		}),
	);
	const searchClient = useSearchClient();

	const form = useForm({
		defaultValues: {
			places,
		},
	});

	const array = useFieldArray({
		control: form.control,
		name: 'places',
	});

	useEffect(() => {
		form.setValue('places', places);
	}, [places, form]);

	const [isEditMode, setIsEditMode] = useState(false);

	const isThisUser = meta.isSelf;

	const updateTopPlacesMutation = useMutation(
		orpc.users.updateTopPlaces.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Successfully updated favorite locations');
				setIsEditMode(false);
			},
		}),
	);

	return (
		<div className={cn(className)}>
			<div className="font-medium text-2xl">
				<span>Favorite Locations</span>
				{isThisUser && (
					<Button
						variant="ghost"
						className="ml-2"
						onClick={() => setIsEditMode((prev) => !prev)}
					>
						<span className="sr-only">Edit</span>
						<Settings2Icon className="size-4" />
					</Button>
				)}
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4">
				{isEditMode && (
					<div className="col-span-full flex items-center gap-2">
						<Button
							onClick={(e) => {
								e.preventDefault();
								updateTopPlacesMutation.mutate({
									placesIds: form.getValues('places').map((place) => place.id),
								});
							}}
						>
							Save
						</Button>
						<Button
							variant="ghost"
							onClick={(e) => {
								e.preventDefault();
								setIsEditMode(false);
								form.reset();
							}}
						>
							Cancel
						</Button>
					</div>
				)}

				{isEditMode && form.watch('places').length < 4 && (
					<div className="col-span-2">
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
									const alreadyInList = array.fields.some(
										(lo) => lo.id === v.id,
									);

									if (alreadyInList) {
										toast.error('Location is already added.');
										return;
									}

									if (array.fields.length >= maxAllowedCount) {
										toast.error(
											`Maximum ${maxAllowedCount} locations can be added.`,
										);
										return;
									}

									updateTopPlacesMutation.mutate({
										placesIds: [
											...form.getValues('places').map((place) => place.id),
											v.id,
										],
									});
								}}
							/>
						</InstantSearch>
					</div>
				)}

				{form.watch('places').length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-4">
						<span className="text-muted-foreground">
							{isThisUser ? 'You' : 'This user'} haven&apos;t added any favorite
							locations yet.
						</span>
					</div>
				)}

				{form.watch('places').map((place, i) => (
					<Link
						to="/p/$id"
						key={place.id}
						className={cn('flex flex-row items-center justify-between gap-4', {
							'col-span-2': isEditMode,
						})}
						params={{
							id: place.id,
						}}
					>
						<PlaceCard
							key={place.id}
							place={place}
							hoverEffects={!isEditMode}
						/>

						{isEditMode && (
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									disabled={i === 0}
									onClick={(e) => {
										e.preventDefault();
										array.swap(i, i - 1);
									}}
								>
									<span className="sr-only">Move up</span>
									<ChevronUpIcon className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									disabled={i === form.watch('places').length - 1}
									onClick={(e) => {
										e.preventDefault();
										array.swap(i, i + 1);
									}}
								>
									<span className="sr-only">Move down</span>
									<ChevronDownIcon className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.preventDefault();
										array.remove(i);
									}}
								>
									<span className="sr-only">Remove</span>
									<XIcon className="size-4" />
								</Button>
							</div>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
