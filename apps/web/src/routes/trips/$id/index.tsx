import {
	createFileRoute,
	getRouteApi,
	Link,
	useNavigate,
} from '@tanstack/react-router';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@wanderlust/ui/components/accordion';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	addDays,
	eachDayOfInterval,
	formatDate,
	isWithinInterval,
} from 'date-fns';
import { useMemo } from 'react';
import { AppMessage } from '@/components/app-message';
import { CollapsibleText } from '@/components/collapsible-text';
import { PlaceCard } from '@/components/place-card';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { InfoCard } from './-info-card';
import { UpsertLocationDialog } from './-upsert-location-dialog';

export const Route = createFileRoute('/trips/$id/')({
	component: RouteComponent,
});

function RouteComponent() {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');
	const navigate = useNavigate();

	const intervalDays = eachDayOfInterval({
		start: trip.startAt,
		end: trip.endAt,
	});

	const days = intervalDays.map((day) => {
		return {
			day,
			locations: trip.locations.filter((loc) =>
				isWithinInterval(new Date(loc.scheduledTime), {
					start: day,
					end: addDays(day, 1),
				}),
			),
		};
	});

	const defaultOpenDays = useMemo(() => {
		const indices: number[] = [];

		for (let i = 0; i < days.length; i += 1) {
			// biome-ignore lint/style/noNonNullAssertion: TODO
			if (days[i]!.locations.length > 0) {
				indices.push(i);
			}
		}

		return indices.map((i) => `day-${i}`);
	}, [days]);

	return (
		<div className="mt-4">
			<div>
				<CollapsibleText
					text={
						trip.description.length > 0 ? trip.description : 'No description.'
					}
					className="mt-2"
					charLimit={500}
				/>
			</div>

			<div className="mt-4 grid gap-4 sm:grid-cols-3">
				<InfoCard type="participants" count={trip.participants.length + 1} />

				<InfoCard type="days" count={intervalDays.length} />

				<InfoCard type="locations" count={trip.locations.length} />
			</div>

			<div className="">
				<div className="my-4">{isPrivileged && <UpsertLocationDialog />}</div>

				<Accordion type="multiple" defaultValue={defaultOpenDays}>
					{days.map(({ day, locations }, i) => (
						<AccordionItem
							value={`day-${i}`}
							key={`day-${day.toISOString()}`}
							className="mt-2 border-none"
						>
							<AccordionTrigger className="flex w-full items-center">
								<div className="font-semibold text-lg">Day {i + 1}</div>

								<div className="ml-auto text-muted-foreground text-sm">
									{formatDate(day, 'dd MMM')}
								</div>
							</AccordionTrigger>
							<AccordionContent
								className={cn('my-4 grid grid-cols-1 gap-16', {
									'gap-16 border-border border-l-4': locations.length > 0,
								})}
							>
								{locations.length === 0 && (
									<AppMessage
										emptyMessage="No locations scheduled for this day"
										imageClassName="size-16"
										showBackButton={false}
										className="col-span-full my-4"
									/>
								)}

								{locations
									.sort(
										(a, b) =>
											new Date(a.scheduledTime).getTime() -
											new Date(b.scheduledTime).getTime(),
									)
									.map((loc) => (
										<div
											key={loc.scheduledTime.toISOString()}
											className="ml-2 flex items-center gap-4"
										>
											<div className="mt-20 flex items-center gap-2 self-start">
												<div className="h-1 w-8 min-w-8 bg-border" />
												<div className="text-lg text-muted-foreground">
													{formatDate(loc.scheduledTime, 'HH:mm')}
												</div>
											</div>
											<div>
												<Link
													to="/p/$id"
													params={{
														id: loc.placeId,
													}}
												>
													<PlaceCard className="max-w-xs" place={loc.place} />
												</Link>
												<div className="mt-4">
													<div className="text-muted-foreground text-sm">
														{loc.description}
													</div>
												</div>
											</div>
											{isPrivileged && (
												<div className="ml-auto self-start">
													<UpsertLocationDialog
														onOpen={() => {
															navigate({
																to: '.',
																search: () => ({
																	showLocationDialog: true,
																	isUpdate: true,
																	placeId: loc.placeId,
																	description: loc.description,
																	scheduledTime:
																		loc.scheduledTime.toISOString(),
																	locId: loc.id,
																}),
															});
														}}
													/>
												</div>
											)}
										</div>
									))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
