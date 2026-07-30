import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormElement } from '@/components/form';
import { toTitleCase } from '@/lib/text';
import { DateSelection } from './date-selection';
import { useCreateItineraryItemMutation, useTripId } from './hooks';

const schema = z.object({
	title: z.string({ error: 'Title is required' }),
	scheduledTime: z.date({ error: 'Scheduled time is required' }),
	booked: z.boolean().optional(),
	reservationNumber: z.string().optional(),
	notes: z.string().optional(),
	transportationMode: z
		.enum(['boat', 'bus', 'car', 'flight', 'other', 'train'])
		.optional(),
	transportationName: z.string().optional(),
	departureLocation: z.string().optional(),
	departureTime: z.date({ error: 'Departure time is invalid' }).optional(),
	arrivalLocation: z.string().optional(),
	arrivalTime: z.date({ error: 'Arrival time is invalid' }).optional(),
	transportationConfirmationNumber: z.string().optional(),
});

const transportModes = ['flight', 'car', 'train', 'bus', 'boat', 'other'];

type Schema = z.infer<typeof schema>;

export function TransportationView() {
	const form = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const tripId = useTripId();
	const mutation = useCreateItineraryItemMutation();

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate({
			tripId: tripId,
			type: 'transportation',
			...data,
		});
	});

	const { Element } = useFormElement(form.control);

	return (
		<form id="itinerary-form" onSubmit={onSubmit}>
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Transportation Details</FieldLegend>
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
						your transportation.
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
								placeholder="Any additional notes about this transportation"
								{...r.field}
							/>
						)}
					</Element>

					<Element
						name="transportationMode"
						label="Transportation Mode"
						customize={{
							field: {
								orientation: 'horizontal',
							},
						}}
					>
						{(r, id) => (
							<Select
								name={r.field.name}
								value={r.field.value}
								onValueChange={r.field.onChange}
							>
								<SelectTrigger
									id={id}
									aria-invalid={r.fieldState.invalid}
									className="ml-auto min-w-64"
								>
									<SelectValue placeholder="Transportation Mode" />
								</SelectTrigger>
								<SelectContent position="popper" align="end">
									{transportModes.map((key) => (
										<SelectItem key={key} value={key}>
											{toTitleCase(key)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</Element>

					<Element name="transportationName" label="Transportation Name">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Transportation Name (e.g., Turkish Airlines, Amtrak)"
								{...r.field}
							/>
						)}
					</Element>

					<div className="flex flex-row gap-4">
						<Element name="departureLocation" label="Departure Location">
							{(r, id) => (
								<Input
									id={id}
									aria-invalid={r.fieldState.invalid}
									placeholder="Departure Location (e.g., LAX)"
									{...r.field}
								/>
							)}
						</Element>
						<Element name="departureTime" label="Departure Time">
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

					<div className="flex flex-row gap-4">
						<Element name="arrivalLocation" label="Arrival Location">
							{(r, id) => (
								<Input
									id={id}
									aria-invalid={r.fieldState.invalid}
									placeholder="Arrival Location (e.g., Atlanta Airport)"
									{...r.field}
								/>
							)}
						</Element>
						<Element name="arrivalTime" label="Arrival Time">
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

					<Element
						name="transportationConfirmationNumber"
						label="Confirmation Number"
					>
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Confirmation Number (e.g., Flight PNR, Train Ticket Number)"
								{...r.field}
							/>
						)}
					</Element>
				</FieldSet>
			</FieldGroup>
		</form>
	);
}
