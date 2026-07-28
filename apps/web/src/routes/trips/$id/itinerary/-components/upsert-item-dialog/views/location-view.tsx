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
import { DateSelection } from './date-selection';

const schema = z.object({
	scheduledTime: z.date({ error: 'Scheduled time is required' }),
	booked: z.boolean().optional(),
	reservationNumber: z.string().optional(),
	notes: z.string().optional(),
	placeId: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function LocationView() {
	const [selectedPlaceResult, setSelectedPlaceResult] =
		useState<TPlaceHit | null>(null);
	const form = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log(data);
	});

	const { Element } = useFormElement(form.control);

	return (
		<form id="itinerary-form" onSubmit={onSubmit}>
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Event Details</FieldLegend>
					<FieldDescription>Required fields</FieldDescription>
					<Element name="scheduledTime" label="Scheduled Time">
						{(r, id) => (
							<DateSelection
								id={id}
								value={r.field.value}
								onChange={r.field.onChange}
							/>
						)}
					</Element>
				</FieldSet>

				<FieldSeparator />

				<FieldSet>
					<FieldLegend>Optional Fields</FieldLegend>
					<FieldDescription>
						These fields are optional but can provide additional context for
						your location.
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
								placeholder="Any additional notes about this location"
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
								setSelectedPlaceResult(item);
							}}
						/>
					</div>

					{selectedPlaceResult && (
						<div className="flex flex-row items-center gap-4">
							<PlaceCard place={selectedPlaceResult.place} variant="item" />
							<Button
								type="button"
								variant="destructive"
								size="icon-sm"
								onClick={() => {
									setSelectedPlaceResult(null);
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
