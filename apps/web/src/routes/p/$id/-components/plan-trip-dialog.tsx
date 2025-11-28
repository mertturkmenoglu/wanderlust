import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { MapIcon, PlusIcon, XIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';

type Props = {
	className?: string;
};

export function PlanTripDialog({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const auth = useContext(AuthContext);

	useEffect(() => {
		if (open && !auth.user) {
			navigate({
				to: '/sign-in',
			});
		}
	}, [open, auth.user, navigate]);

	const [state, setState] = useState<'choose' | 'new-trip' | 'add-to-trip'>(
		'choose',
	);

	const query = api.useQuery(
		'get',
		'/api/v2/trips/',
		{},
		{ enabled: !!auth.user && open },
	);

	return (
		<AlertDialog
			open={open}
			onOpenChange={(o) => {
				setState('choose');
				setOpen(o);
			}}
		>
			<AlertDialogTrigger asChild>
				<Button
					size="lg"
					className="mx-auto mt-4 w-full md:w-2/3"
					onClick={() => setOpen(true)}
				>
					<MapIcon className="size-5" />
					<span className="text-base">Plan a trip</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className={cn(className)}>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center justify-between gap-2">
						<span>Plan a Trip to {place.name}</span>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							<XIcon className="size-4 text-muted-foreground" />
						</Button>
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="grid grid-cols-2 gap-4">
					{state === 'choose' && (
						<>
							<button
								type="button"
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-4 rounded-md bg-muted p-4',
									'font-medium',
									'group transition-all duration-300 ease-in-out hover:bg-primary hover:text-white',
								)}
								onClick={() => {
									navigate({
										to: '/trips',
										search: () => ({ showNewDialog: true }),
									});
								}}
							>
								<PlusIcon className="size-6 text-primary group-hover:text-white" />
								<span>New Trip</span>
							</button>

							<button
								type="button"
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-4 rounded-md bg-muted p-4',
									'font-medium',
									'group transition-all duration-300 ease-in-out hover:bg-primary hover:text-white',
								)}
								onClick={() => setState('add-to-trip')}
							>
								<MapIcon className="size-6 text-primary group-hover:text-white" />
								<span>Add to Existing Trip</span>
							</button>
						</>
					)}
					{state === 'add-to-trip' && (
						<ScrollArea className="col-span-full h-96 pr-2">
							{query.data?.trips
								.filter(
									(trip) =>
										trip.ownerId === auth.user?.id ||
										trip.participants.some(
											(p) => p.id === auth.user?.id && p.role === 'editor',
										),
								)
								.map((trip) => (
									<button
										key={trip.id}
										type="button"
										className="flex w-full items-center justify-start p-2 hover:bg-primary/10"
										onClick={() => {
											navigate({
												to: '/trips/$id',
												params: {
													id: trip.id,
												},
												search: () => ({
													isUpdate: false,
													placeId: place.id,
													showLocationDialog: true,
													description: `Trip to ${place.name}`,
												}),
											});
										}}
									>
										{trip.title}
									</button>
								))}
							<ScrollBar />
						</ScrollArea>
					)}
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	);
}
