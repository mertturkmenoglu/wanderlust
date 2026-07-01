import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupTextarea,
} from '@wanderlust/ui/components/input-group';
import { SelectContent, SelectItem } from '@wanderlust/ui/components/select';
import { addYears } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { cmp } from '@/components/form';
import { TSTZPicker } from '@/components/tstz-picker';
import { lengthTracker } from '@/lib/form';
import type { CreateTripFormInput } from '@/schemas/create-trip';
import { visibilityOptions } from '@/schemas/trip-visibility';
import { useCreateTripMutation } from './hooks';

export function CreateTripForm() {
	const form = useFormContext<CreateTripFormInput>();
	const mutation = useCreateTripMutation();

	const startAt = form.watch('startAt');

	return (
		<form
			id="create-trip-form"
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate(data);
			})}
		>
			<FieldGroup>
				<cmp.Input
					name="title"
					control={form.control}
					elements={{
						label: {
							children: 'Title',
						},
						input: {
							placeholder: 'My Awesome Trip',
							autoComplete: 'off',
						},
					}}
				/>

				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="description">Description</FieldLabel>

							<InputGroup>
								<InputGroupTextarea
									{...field}
									id="description"
									placeholder="You can add a description for your trip."
									autoComplete="off"
									rows={4}
									aria-invalid={fieldState.invalid}
								/>
								<InputGroupAddon align="block-end">
									{lengthTracker(field.value, 8192)}
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<cmp.Select
					name="visibilityLevel"
					control={form.control}
					label="Visibility"
					description="Change who can see your trip"
					selectContent={
						<SelectContent position="popper" align="end">
							{visibilityOptions.map((op) => (
								<SelectItem key={op.value} value={op.value}>
									{op.label}
								</SelectItem>
							))}
						</SelectContent>
					}
					elements={{
						trigger: {
							className: 'min-w-32',
						},
						value: {
							placeholder: 'Select a visibility',
						},
					}}
				/>

				<Controller
					name="startAt"
					control={form.control}
					render={({ field, fieldState }) => (
						<TSTZPicker
							value={field.value}
							onChange={field.onChange}
							fieldState={fieldState}
							dateLabel="Start Date"
							timeLabel="Start Time"
							calendarProps={{
								className: 'mx-auto',
								startMonth: new Date(),
								endMonth: addYears(new Date(), 1),
								disabled: {
									after: addYears(new Date(), 1),
									before: new Date(),
								},
							}}
						/>
					)}
				/>

				<Controller
					name="endAt"
					control={form.control}
					render={({ field, fieldState }) => (
						<TSTZPicker
							value={field.value}
							onChange={field.onChange}
							fieldState={fieldState}
							dateLabel="End Date"
							timeLabel="End Time"
							calendarProps={{
								className: 'mx-auto',
								startMonth: startAt ?? new Date(),
								endMonth: addYears(startAt ?? new Date(), 1),
								disabled: {
									after: addYears(startAt ?? new Date(), 1),
									before: startAt ?? new Date(),
								},
							}}
						/>
					)}
				/>
			</FieldGroup>
		</form>
	);
}
