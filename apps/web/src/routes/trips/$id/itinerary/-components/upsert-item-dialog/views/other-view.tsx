import { zodResolver } from '@hookform/resolvers/zod';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormElement } from '@/components/form';
import { DateSelection } from './date-selection';
import { useCreateItineraryItemMutation, useTripId } from './hooks';

const schema = z.object({
	scheduledTime: z.date({ error: 'Scheduled time is required' }),
	notes: z.string().optional(),
	title: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function OtherView() {
	const form = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const tripId = useTripId();
	const mutation = useCreateItineraryItemMutation();

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate({
			tripId: tripId,
			type: 'other',
			...data,
		});
	});

	const { Element } = useFormElement(form.control);

	return (
		<form id="itinerary-form" onSubmit={onSubmit}>
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Itinerary Item Details</FieldLegend>
					<FieldDescription>Required fields</FieldDescription>
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
				</FieldSet>
			</FieldGroup>
		</form>
	);
}
