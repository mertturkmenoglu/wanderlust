import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
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
import { addYears } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { TSTZPicker } from '@/components/tstz-picker';
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
				<Controller
					name="title"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="title">Title</FieldLabel>
							<Input
								{...field}
								id="title"
								placeholder="My Awesome Trip"
								autoComplete="off"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="description">Description</FieldLabel>
							<Textarea
								{...field}
								id="description"
								placeholder="You can add a description for your trip."
								autoComplete="off"
								rows={4}
								className="max-h-32"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="visibilityLevel"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} orientation="horizontal">
							<FieldContent>
								<FieldLabel htmlFor="visibility">Visibility</FieldLabel>
								<FieldDescription>
									{visibilityOptions.find((op) => op.value === field.value)
										?.info ?? 'Change who can see your trip'}
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</FieldDescription>
							</FieldContent>

							<Select
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									id="visibility"
									aria-invalid={fieldState.invalid}
									className="min-w-32"
								>
									<SelectValue placeholder="Select a visibility" />
								</SelectTrigger>
								<SelectContent position="popper" align="end">
									{visibilityOptions.map((op) => (
										<SelectItem key={op.value} value={op.value}>
											{op.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
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
