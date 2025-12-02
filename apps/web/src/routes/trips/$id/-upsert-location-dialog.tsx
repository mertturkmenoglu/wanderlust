import { useMutation, useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import {
	ArrowLeftIcon,
	MapPinPlusIcon,
	Settings2Icon,
	Trash2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { Autocomplete } from '@/components/blocks/autocomplete';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { orpc } from '@/lib/orpc';

const fmtString = "yyyy-MM-dd'T'HH:mm";

type Props = {
	onOpen?: () => void;
};

export function UpsertLocationDialog({ onOpen }: Props) {
	const route = getRouteApi('/trips/$id');
	const {
		showLocationDialog,
		isUpdate,
		placeId,
		description,
		scheduledTime,
		locId,
	} = route.useSearch();
	const { id: tripId } = route.useParams();
	const searchClient = useSearchClient();
	const invalidate = useInvalidator();
	const navigate = useNavigate();

	const query = useQuery(
		orpc.places.get.queryOptions({
			input: {
				id: placeId ?? '',
			},
			enabled: placeId !== undefined,
			retry: false,
		}),
	);

	const [desc, setDesc] = useState('');
	const [time, setTime] = useState(formatDate(new Date(), fmtString));
	const open = showLocationDialog === true;

	useEffect(() => {
		setDesc((prev) => (description !== undefined ? description : prev));
		setTime((prev) =>
			scheduledTime !== undefined ? formatDate(scheduledTime, fmtString) : prev,
		);
	}, [description, scheduledTime]);

	const closeDialog = () => {
		setDesc('');
		setTime(formatDate(new Date(), fmtString));

		navigate({
			to: '.',
			search: () => ({}),
		});
	};

	const openDialog = () => {
		if (onOpen) {
			onOpen();
			return;
		}

		navigate({
			to: '.',
			search: () => ({ showLocationDialog: true }),
		});
	};

	const addLocationMutation = useMutation(
		orpc.trips.createLocation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				setDesc('');
				setTime(formatDate(new Date(), fmtString));
				closeDialog();
			},
		}),
	);

	const updateLocationMutation = useMutation(
		orpc.trips.updateLocation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				closeDialog();
			},
		}),
	);

	const deleteLocationMutation = useMutation(
		orpc.trips.deleteLocation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				closeDialog();
			},
		}),
	);

	return (
		<AlertDialog
			open={open}
			onOpenChange={(open) => {
				if (open) {
					openDialog();
					return;
				}
				closeDialog();
			}}
		>
			<AlertDialogTrigger asChild>
				{isUpdate || onOpen ? (
					<Button variant="ghost" size="icon">
						<Settings2Icon className="size-4" />
					</Button>
				) : (
					<Button
						variant="secondary"
						size="sm"
						className="ml-auto"
						onClick={() => {
							openDialog();
						}}
					>
						<MapPinPlusIcon className="size-4" />
						<span>Add Location</span>
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent className="min-h-[600px]">
				<AlertDialogHeader>
					<AlertDialogTitle>
						{isUpdate ? 'Update Location' : 'Add Location to Trip'}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{placeId !== undefined ? (
							<div>
								{!isUpdate && (
									<Button
										variant="link"
										size="sm"
										className="px-0!"
										onClick={() => {
											navigate({
												to: '.',
												search: (prev) => ({ ...prev, placeId: undefined }),
											});
										}}
									>
										<ArrowLeftIcon className="size-4" />
										<span>Go back</span>
									</Button>
								)}

								{query.isLoading && (
									<div className="flex items-center justify-center">
										<Spinner className="mx-auto my-16 size-12" />
									</div>
								)}

								{query.data && (
									<>
										<img
											src={query.data.place.assets[0]?.url ?? ''}
											alt=""
											className="mt-4 aspect-5/2 w-full rounded-md object-cover"
										/>
										<div className="mt-4">
											<div className="font-semibold text-black text-lg leading-none tracking-tight">
												{query.data.place.name}
											</div>
											<div className="my-1 line-clamp-1 text-muted-foreground text-sm">
												{query.data.place.address.city.name} /{' '}
												{query.data.place.address.city.countryName}
											</div>

											<div className="font-semibold text-primary text-sm leading-none tracking-tight">
												{query.data.place.category.name}
											</div>
										</div>
									</>
								)}

								<div className="mt-4">
									<div>
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											placeholder="You can add a description for this location."
											value={desc}
											className="mt-1"
											onChange={(e) => setDesc(e.target.value)}
										/>
									</div>

									<div className="mt-4">
										<Label htmlFor="scheduledTime">
											Scheduled Time{' '}
											<span className="-ml-1 font-normal text-destructive-foreground text-xs">
												*
											</span>
										</Label>
										<Input
											type="datetime-local"
											id="scheduledTime"
											className="mt-1"
											value={time}
											onChange={(e) => setTime(e.target.value)}
										/>
									</div>
								</div>
							</div>
						) : (
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
										navigate({
											to: '.',
											search: (prev) => ({ ...prev, placeId: v.id }),
										});
									}}
								/>
							</InstantSearch>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-auto">
					{isUpdate && (
						<Button
							variant="destructive"
							onClick={(e) => {
								e.preventDefault();
								if (confirm('Are you sure you want to delete this location?')) {
									if (!locId) {
										return;
									}
									deleteLocationMutation.mutate({
										id: tripId,
										locationId: locId,
									});
								}
							}}
						>
							<Trash2Icon className="size-4" />
							<span>Delete</span>
						</Button>
					)}
					<AlertDialogCancel className="ml-auto">Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={placeId === undefined || addLocationMutation.isPending}
						onClick={(e) => {
							e.preventDefault();
							if (isUpdate && locId !== undefined) {
								updateLocationMutation.mutate({
									id: tripId,
									locationId: locId,
									scheduledTime: new Date(time),
									description: desc,
								});
							} else {
								addLocationMutation.mutate({
									id: tripId,
									placeId: placeId ?? '',
									scheduledTime: new Date(time),
									description: desc,
								});
							}
						}}
					>
						{isUpdate ? 'Update' : 'Add'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
