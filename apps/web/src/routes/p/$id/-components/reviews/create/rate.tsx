import { Field, FieldError } from '@wanderlust/ui/components/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Rating } from '@/components/rating';
import type { FormInput } from './hooks';

export function Rate() {
	const form = useFormContext<FormInput>();

	return (
		<div>
			<Controller
				name="rating"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="flex flex-row justify-center"
					>
						<div className="max-w-fit">
							<Rating
								id="rating"
								value={field.value}
								onChange={({ value }) => field.onChange(value)}
								starsClassName="size-6 md:size-8"
							/>
						</div>
						<span className="sr-only">Rating</span>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</div>
	);
}
