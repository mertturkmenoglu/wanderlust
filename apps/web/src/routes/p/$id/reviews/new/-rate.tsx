import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import { cn } from '@wanderlust/ui/lib/utils';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Rating } from '@/components/rating';
import type { FormInput } from './-hooks';

type Props = {
	className?: string;
};

const ratingTexts = ['Unpleasant', 'Bad', 'Average', 'Good', 'Outstanding'];

export function Rate({ className }: Props) {
	const form = useFormContext<FormInput>();
	const [tempRating, setTempRating] = useState(form.getValues('rating') ?? 5);
	const text = tempRating ? ratingTexts[tempRating - 1] : '';

	return (
		<div className={cn(className)}>
			<Controller
				name="rating"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="flex flex-row">
						<div className="max-w-fit">
							<FieldLabel htmlFor="rating">Rating</FieldLabel>
							<div className="mt-2 flex items-center gap-2">
								<Rating
									id="rating"
									value={field.value}
									onChange={({ value }) => {
										field.onChange(value);
										setTempRating(value);
									}}
									onHoverChange={({ hoveredValue }) => {
										if (hoveredValue !== -1) {
											setTempRating(hoveredValue);
										} else {
											setTempRating(field.value);
										}
									}}
									starsClassName="size-6 md:size-8"
								/>
								<span className="font-medium text-lg">{text}</span>
							</div>
						</div>
						<span className="sr-only">Rating</span>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</div>
	);
}
