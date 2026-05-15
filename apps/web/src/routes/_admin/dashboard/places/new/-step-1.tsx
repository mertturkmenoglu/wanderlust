import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { Controller, useFormContext } from 'react-hook-form';

export function Step1() {
	const form = useFormContext();

	return (
		<>
			<Controller
				name="name"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<Input
							{...field}
							id="name"
							placeholder="Name"
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<div />

			<Controller
				name="description"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="col-span-2">
						<FieldLabel htmlFor="description">Description</FieldLabel>
						<Textarea
							{...field}
							id="textarea"
							autoComplete="off"
							rows={6}
							className="min-h-32"
							placeholder="Description of the place"
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
