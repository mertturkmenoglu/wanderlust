import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import {
	KeyValueList,
	type KeyValueListItem,
} from '@wanderlust/ui/components/key-value-list';
import { formatDate } from 'date-fns';
import {
	CheckIcon,
	HomeIcon,
	MapPinIcon,
	NotepadTextIcon,
	PartyPopperIcon,
	PlaneIcon,
	UtensilsIcon,
	XIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { CollapsibleText } from '@/components/collapsible-text';
import { PlaceCard } from '@/components/place-card';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import type { Outputs } from '@/lib/orpc';
import { toTitleCase } from '@/lib/text';
import { UpsertItemDialog } from './upsert-item-dialog';

type Props = {
	item: Outputs['trips']['get']['trip']['itineraryItems'][number];
};

export function ItineraryItem({ item }: Props) {
	const isPrivileged = useTripIsPrivileged();

	const hhmm = formatDate(item.scheduledTime, 'HH:mm');
	const details = useMemo(() => {
		const arr: Array<KeyValueListItem> = [];

		if (item.booked !== null) {
			arr.push({
				label: 'Booked',
				value: item.booked ? (
					<CheckIcon className="size-4" />
				) : (
					<XIcon className="size-4" />
				),
			});
		}

		if (item.checkInTime !== null) {
			arr.push({
				label: 'Check-in Time',
				value: formatDate(item.checkInTime, 'HH:mm'),
			});
		}

		if (item.checkOutTime !== null) {
			arr.push({
				label: 'Check-out Time',
				value: formatDate(item.checkOutTime, 'HH:mm'),
			});
		}

		if (item.reservationNumber !== null) {
			arr.push({
				label: 'Reservation Number',
				value: item.reservationNumber,
			});
		}

		if (item.transportationMode !== null) {
			arr.push({
				label: 'Transportation Mode',
				value: toTitleCase(item.transportationMode),
			});
		}

		if (item.transportationName !== null) {
			arr.push({
				label: 'Transportation Name',
				value: item.transportationName,
			});
		}

		if (item.departureLocation !== null) {
			arr.push({
				label: 'Departure Location',
				value: item.departureLocation,
			});
		}

		if (item.departureTime !== null) {
			arr.push({
				label: 'Departure Time',
				value: formatDate(item.departureTime, 'HH:mm'),
			});
		}

		if (item.arrivalLocation !== null) {
			arr.push({
				label: 'Arrival Location',
				value: item.arrivalLocation,
			});
		}

		if (item.arrivalTime !== null) {
			arr.push({
				label: 'Arrival Time',
				value: formatDate(item.arrivalTime, 'HH:mm'),
			});
		}

		if (item.transportationConfirmationNumber !== null) {
			arr.push({
				label: 'Confirmation Number',
				value: item.transportationConfirmationNumber,
			});
		}

		return arr;
	}, [item]);

	return (
		<div className="ml-2 flex items-center gap-4">
			<div className="mt-20 flex items-center gap-2 self-start">
				<div className="h-1 w-8 min-w-8 bg-border" />
				<div className="text-lg text-muted-foreground">{hhmm}</div>
			</div>
			<div className="w-8/12 min-w-max">
				<Card size="default" className="min-w-max">
					<CardHeader>
						<CardTitle>
							{item.title ?? `${toTitleCase(item.type)} Item`}
						</CardTitle>
						<CardDescription>
							{item.notes && <CollapsibleText text={item.notes} />}
						</CardDescription>
						<CardAction>
							<div
								className={buttonVariants({
									variant: 'secondary',
									size: 'icon-sm',
								})}
							>
								{item.type === 'accommodation' && <HomeIcon />}
								{item.type === 'transportation' && <PlaneIcon />}
								{item.type === 'event' && <PartyPopperIcon />}
								{item.type === 'location' && <MapPinIcon />}
								{item.type === 'dining' && <UtensilsIcon />}
								{item.type === 'other' && <NotepadTextIcon />}
							</div>
						</CardAction>
					</CardHeader>
					<CardContent>
						{item.place && (
							<PlaceCard
								variant="item"
								as="link"
								place={item.place.place}
								meta={item.place.meta}
							/>
						)}
						<KeyValueList variant="bordered" className="my-4" items={details} />
					</CardContent>
					{isPrivileged && (
						<CardFooter>
							<UpsertItemDialog item={item} />
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	);
}
