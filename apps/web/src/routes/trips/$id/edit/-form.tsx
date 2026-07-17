import { useLoaderData } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@wanderlust/ui/components/alert';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from '@wanderlust/ui/components/input-group';
import { SelectContent, SelectItem } from '@wanderlust/ui/components/select';
import { addYears } from 'date-fns';
import { AlertOctagonIcon, AlertTriangleIcon, Trash2Icon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { cmp } from '@/components/form';
import { TSTZPicker } from '@/components/tstz-picker';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { lengthTracker } from '@/lib/form';
import type { UpdateTripFormInput } from '@/schemas/create-trip';
import { visibilityOptions } from '@/schemas/trip-visibility';
import { useDeleteTripMutation, useUpdateTripMutation } from './-hooks';

export function UpdateTripForm() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const form = useFormContext<UpdateTripFormInput>();
	const confirm = useConfirmDialog();
	const deleteMutation = useDeleteTripMutation();
	const updateMutation = useUpdateTripMutation();

	const startAt = form.watch('startAt');

	return (
		<form
			id="update-trip-form"
			onSubmit={form.handleSubmit((data) => {
				updateMutation.mutate({
					...data,
					id: trip.id,
					requestedAmenities: trip.requestedAmenities,
				});
			})}
			className="flex w-full flex-col"
		>
			<FieldSet>
				<FieldLegend>Edit Your Trip</FieldLegend>
				<FieldDescription>Change your trip info</FieldDescription>
				<FieldGroup>
					<cmp.Input
						name="title"
						control={form.control}
						elements={{
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
										<InputGroupText>
											{lengthTracker(field.value, 8192)}
										</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<FieldSeparator />

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

					<Alert variant="warning" fill="ghost">
						<AlertTriangleIcon />
						<AlertDescription>
							Changing trip visibility may affect who can see your trip and its
							content. Please review your visibility settings carefully.
						</AlertDescription>
					</Alert>

					<FieldSeparator />

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

					<Alert variant="warning" fill="ghost">
						<AlertTriangleIcon />
						<AlertDescription>
							Changing the trip dates may affect the itinerary and other related
							information. Please review your trip schedule carefully.
							<br />
							<br />
							If you have locations planned for the trip that fall outside the
							new date range, we will automatically move them to the start of
							the new date range.
						</AlertDescription>
					</Alert>

					<Button className="ml-auto w-full max-w-xs">Update Trip</Button>
				</FieldGroup>
			</FieldSet>

			<FieldSet className="mt-8">
				<FieldLegend>Dangerous</FieldLegend>
				<FieldDescription>These actions are irreversible</FieldDescription>

				<FieldGroup>
					{confirm.Dialog}

					<Button
						type="button"
						variant="destructive"
						className="w-full max-w-xs"
						onClick={async (e) => {
							e.preventDefault();

							const ok = await confirm.confirm({
								variant: 'destructive',
								confirmText: 'Delete',
								title: 'Delete Trip',
								description: (
									<Alert variant="destructive" fill="ghost">
										<AlertOctagonIcon />
										<AlertDescription>
											Are you sure you want to delete this trip? This action
											cannot be undone and all trip data will be permanently
											removed.
										</AlertDescription>
									</Alert>
								),
							});

							if (!ok) {
								return;
							}

							deleteMutation.mutate({
								id: trip.id,
							});
						}}
					>
						<Trash2Icon />
						<span>Delete Trip</span>
					</Button>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}
