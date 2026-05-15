import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Slider } from '@wanderlust/ui/components/slider';
import { Controller, useFormContext } from 'react-hook-form';

export function Step2() {
	const form = useFormContext();

	return (
		<>
			<Controller
				name="phone"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="phone">Phone</FieldLabel>
						<Input
							{...field}
							id="phone"
							placeholder="+1 (XXX) XXX-XXXX"
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name="website"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="website">Website</FieldLabel>
						<Input
							{...field}
							id="website"
							placeholder="https://www.example.com"
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name="priceLevel"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="priceLevel">
							Price Level - {field.value ?? 1}
						</FieldLabel>
						<Slider
							id="priceLevel"
							min={1}
							max={5}
							className="mt-2"
							defaultValue={[1]}
							onValueChange={field.onChange}
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name="accessibilityLevel"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="accessibilityLevel">
							Accessibility Level - {field.value ?? 1}
						</FieldLabel>
						<Slider
							id="accessibilityLevel"
							min={1}
							max={5}
							className="mt-2"
							defaultValue={[1]}
							onValueChange={field.onChange}
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
