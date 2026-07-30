import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@wanderlust/ui/components/button';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Label } from '@wanderlust/ui/components/label';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormElement } from '@/components/form';
import { PlaceCard } from '@/components/place-card';
import { Search } from '@/components/search';
import type { TPlaceHit } from '@/lib/search';
import { useItineraryContext } from '../hooks';
import { DateSelection } from './date-selection';
import {
	useCreateItineraryItemMutation,
	useTripId,
	useUpdateItineraryItemMutation,
} from './hooks';

const schema = z.object({
	title: z.string({ error: 'Title is required' }),
	scheduledTime: z.date({ error: 'Scheduled time is required' }),
	booked: z.boolean().optional(),
	checkInTime: z.date({ error: 'Check-in time is invalid' }).optional(),
	checkOutTime: z.date({ error: 'Check-out time is invalid' }).optional(),
	reservationNumber: z.string().optional(),
	notes: z.string().optional(),
	placeId: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function AccommodationView() {
	const ctx = useItineraryContext();
	const [selectedPlace, setSelectedPlace] = useState<TPlaceHit['place'] | null>(
		() => {
			if (ctx.initialItem?.place?.place) {
				return ctx.initialItem.place.place;
			}

			return null;
		},
	);

	const form = useForm<Schema>({
		resolver: zodResolver(schema),
		defaultValues: ctx.initialItem
			? {
					booked: ctx.initialItem.booked ?? undefined,
					checkInTime: ctx.initialItem.checkInTime ?? undefined,
					checkOutTime: ctx.initialItem.checkOutTime ?? undefined,
					notes: ctx.initialItem.notes ?? undefined,
					placeId: ctx.initialItem.placeId ?? undefined,
					reservationNumber: ctx.initialItem.reservationNumber ?? undefined,
					scheduledTime: ctx.initialItem.scheduledTime,
					title: ctx.initialItem.title ?? undefined,
				}
			: undefined,
	});

	const tripId = useTripId();
	const create = useCreateItineraryItemMutation();
	const edit = useUpdateItineraryItemMutation();

	const onSubmit = form.handleSubmit((data) => {
		if (ctx.mode === 'edit' && ctx.initialItem) {
			edit.mutate({
				...ctx.initialItem,
				...data,
			});
		} else {
			create.mutate({
				tripId: tripId,
				type: 'accommodation',
				...data,
			});
		}
	});

	const { Element } = useFormElement(form.control);

	return (
		<form id="itinerary-form" onSubmit={onSubmit}>
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Accommodation Details</FieldLegend>
					<FieldDescription>Required fields</FieldDescription>
					<Element name="title" label="Title">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Title"
								{...r.field}
							/>
						)}
					</Element>
					<Element name="scheduledTime" label="Scheduled Time">
						{(r, id) => (
							<DateSelection
								id={id}
								value={r.field.value}
								onChange={r.field.onChange}
								fieldState={r.fieldState}
							/>
						)}
					</Element>
				</FieldSet>

				<FieldSeparator />
				<FieldSet>
					<FieldLegend>Optional Fields</FieldLegend>
					<FieldDescription>
						These fields are optional but can provide additional context for
						your accommodation.
					</FieldDescription>

					<Element
						name="booked"
						label="Booked"
						customize={{
							field: {
								orientation: 'horizontal',
							},
						}}
					>
						{(r, id) => (
							<Checkbox
								id={id}
								name={r.field.name}
								checked={r.field.value}
								onCheckedChange={r.field.onChange}
							/>
						)}
					</Element>

					<div className="flex flex-row gap-4">
						<Element name="checkInTime" label="Check-In Time">
							{(r, id) => (
								<DateSelection
									id={id}
									value={r.field.value}
									onChange={r.field.onChange}
									fieldState={r.fieldState}
								/>
							)}
						</Element>

						<Element name="checkOutTime" label="Check-Out Time">
							{(r, id) => (
								<DateSelection
									id={id}
									value={r.field.value}
									onChange={r.field.onChange}
									fieldState={r.fieldState}
								/>
							)}
						</Element>
					</div>

					<Element name="reservationNumber" label="Reservation Number">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Reservation Number"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="notes" label="Notes">
						{(r, id) => (
							<Textarea
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Any additional notes about this accommodation"
								{...r.field}
							/>
						)}
					</Element>

					<div className="flex flex-col gap-2">
						<Label>Place</Label>

						<Search
							variant="local"
							onItemClick={(v) => {
								const item = v as TPlaceHit;
								form.setValue('placeId', item.place.id);
								setSelectedPlace(item.place);
							}}
						/>
					</div>

					{selectedPlace && (
						<div className="flex flex-row items-center gap-4">
							<PlaceCard place={selectedPlace} variant="item" />
							<Button
								type="button"
								variant="destructive"
								size="icon-sm"
								onClick={() => {
									setSelectedPlace(null);
									form.setValue('placeId', undefined);
								}}
							>
								<XIcon />
								<span className="sr-only">Remove place selection</span>
							</Button>
						</div>
					)}
				</FieldSet>
			</FieldGroup>
		</form>
	);
}
