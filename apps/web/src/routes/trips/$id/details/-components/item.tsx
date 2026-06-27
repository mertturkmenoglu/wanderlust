import { Link, useNavigate } from '@tanstack/react-router';
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@wanderlust/ui/components/accordion';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDate } from 'date-fns';
import { AppMessage } from '@/components/app-message';
import { PlaceCard } from '@/components/place-card';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { useTripDays } from './hooks';
import { UpsertLocationDialog } from './upsert-location-dialog';

type Props = {
	index: number;
};

export function TripDetailsItem({ index }: Props) {
	const isPrivileged = useTripIsPrivileged();
	const navigate = useNavigate({ from: '/trips/$id/details/' });
	const days = useTripDays();
	const { day, locations } = days[index];

	return (
		<AccordionItem
			value={`day-${index}`}
			key={`day-${day.toISOString()}`}
			className="mt-2 border-none"
		>
			<AccordionTrigger className="flex w-full items-center">
				<div className="font-semibold text-lg">Day {index + 1}</div>

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
						empty="Nothing is scheduled for this day"
						classNames={{
							root: 'col-span-full my-4',
							logo: 'size-16',
						}}
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
							<div className="min-w-max">
								<Link
									to="/p/$id"
									params={{
										id: loc.placeId,
									}}
									className="min-w-max"
								>
									<PlaceCard
										className="min-w-xs"
										place={loc.place}
										meta={loc.meta}
									/>
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
													dialog: true,
													update: true,
													placeId: loc.placeId,
													description: loc.description,
													time: loc.scheduledTime.toISOString(),
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
	);
}
